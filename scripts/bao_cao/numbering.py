"""Quản lý danh sách đánh số tự khởi động lại (bẫy OOXML #1 và #2 — xem phase-02-loi-script.md).

Bẫy #1: bộ đếm nằm ở w:abstractNum, không phải w:num. Nhiều w:num trỏ chung một w:abstractNum
vẫn đếm tiếp một dãy — mỗi w:num muốn bắt đầu lại từ 1 phải mang riêng
<w:lvlOverride><w:startOverride w:val="1"/></w:lvlOverride>.

Bẫy #2: thứ tự phần tử con trong w:pPr là bắt buộc theo schema — append thẳng một numPr tự
tạo có thể sai thứ tự khiến LibreOffice từ chối mở file. Dùng get_or_add_numPr() (và
get_or_add_numId/get_or_add_ilvl) của chính python-docx để nó tự chèn đúng vị trí.
"""
from __future__ import annotations

from docx.document import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph


class NumberingManager:
    """Cấp numId mới cho mỗi danh sách đánh số muốn bắt đầu lại từ 1 độc lập với các danh
    sách khác trong cùng tài liệu."""

    def __init__(self, document: Document):
        self._document = document
        self._numbering_element = document.part.numbering_part.element
        self._shared_abstract_num_id = self._dam_bao_abstract_num_dung_chung()

    def _max_id(self, tag: str, attr: str) -> int:
        ids = [
            int(el.get(qn(attr)))
            for el in self._numbering_element.findall(qn(tag))
            if el.get(qn(attr)) is not None
        ]
        return max(ids) if ids else -1

    def _dam_bao_abstract_num_dung_chung(self) -> int:
        """Tạo (một lần) một w:abstractNum kiểu decimal dùng chung cho mọi danh sách số của
        báo cáo. Việc bắt đầu lại từ 1 xử lý ở cấp w:num (lvlOverride), không phải ở đây."""
        new_id = self._max_id("w:abstractNum", "w:abstractNumId") + 1
        abstract_num = OxmlElement("w:abstractNum")
        abstract_num.set(qn("w:abstractNumId"), str(new_id))

        multi_level = OxmlElement("w:multiLevelType")
        multi_level.set(qn("w:val"), "singleLevel")
        abstract_num.append(multi_level)

        lvl = OxmlElement("w:lvl")
        lvl.set(qn("w:ilvl"), "0")

        start = OxmlElement("w:start")
        start.set(qn("w:val"), "1")
        lvl.append(start)

        num_fmt = OxmlElement("w:numFmt")
        num_fmt.set(qn("w:val"), "decimal")
        lvl.append(num_fmt)

        lvl_text = OxmlElement("w:lvlText")
        lvl_text.set(qn("w:val"), "%1.")
        lvl.append(lvl_text)

        lvl_jc = OxmlElement("w:lvlJc")
        lvl_jc.set(qn("w:val"), "left")
        lvl.append(lvl_jc)

        p_pr = OxmlElement("w:pPr")
        ind = OxmlElement("w:ind")
        ind.set(qn("w:left"), "720")
        ind.set(qn("w:hanging"), "360")
        p_pr.append(ind)
        lvl.append(p_pr)

        abstract_num.append(lvl)
        # w:abstractNum phải nằm trước mọi w:num trong word/numbering.xml theo schema
        first_num = self._numbering_element.find(qn("w:num"))
        if first_num is not None:
            first_num.addprevious(abstract_num)
        else:
            self._numbering_element.append(abstract_num)
        return new_id

    def danh_sach_moi_bat_dau_lai_tu_1(self) -> int:
        """Trả về một numId MỚI, riêng cho một danh sách sẽ bắt đầu đếm lại từ 1 — gọi hàm
        này một lần cho mỗi danh sách đánh số độc lập trong tài liệu (không tái dùng numId
        giữa các danh sách khác nhau, kể cả khi chúng có vẻ giống nhau). Dùng
        CT_Numbering.add_num()/CT_Num.add_lvlOverride()/CT_NumLvl.add_startOverride() — API
        gốc của python-docx — để phần tử được chèn đúng vị trí, không tự dựng XML thủ công."""
        num = self._numbering_element.add_num(self._shared_abstract_num_id)
        lvl_override = num.add_lvlOverride(ilvl=0)
        lvl_override.add_startOverride(val=1)
        return num.numId

    @staticmethod
    def ap_dung_vao_doan(paragraph: Paragraph, num_id: int, ilvl: int = 0) -> None:
        """Gán numPr cho một paragraph — dùng get_or_add_numPr() để python-docx tự chèn đúng
        thứ tự phần tử con trong w:pPr (bẫy OOXML #2), không tự dựng/append thủ công."""
        p_pr = paragraph._p.get_or_add_pPr()
        num_pr = p_pr.get_or_add_numPr()
        num_pr.get_or_add_ilvl().val = ilvl
        num_pr.get_or_add_numId().val = num_id
