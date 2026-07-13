from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String, Line

def generate_certificate_pdf(project: dict) -> BytesIO:
    """
    Generates a beautifully styled, official PDF certificate for a verified Blue Carbon Project.
    Returns a BytesIO stream containing the PDF.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f4c5c'),
        alignment=1, # Center
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CertSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#e36414'),
        alignment=1, # Center
        spaceAfter=20
    )

    body_style = ParagraphStyle(
        'CertBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#222222'),
        alignment=1, # Center
        spaceAfter=15
    )

    label_style = ParagraphStyle(
        'CertLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0f4c5c')
    )

    value_style = ParagraphStyle(
        'CertValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#333333')
    )

    story = []

    # Outer border / decoration
    # We can add elements to the story
    story.append(Spacer(1, 10))

    # Visual header separator
    header_draw = Drawing(532, 10)
    header_draw.add(Rect(0, 0, 532, 8, fillColor=colors.HexColor('#0f4c5c'), strokeColor=None))
    header_draw.add(Rect(0, 8, 532, 2, fillColor=colors.HexColor('#fb8b24'), strokeColor=None))
    story.append(header_draw)
    story.append(Spacer(1, 20))

    # Titles
    story.append(Paragraph("BLUE CARBON REGISTRY", title_style))
    story.append(Paragraph("CERTIFICATE OF SCIENTIFIC VERIFICATION & CREDIT ISSUANCE", subtitle_style))
    story.append(Spacer(1, 15))

    # Certification statement
    cert_text = (
        f"This document certifies that the restoration project <b>{project['name']}</b> has been "
        f"quantitatively analyzed via satellite remote sensing and validated by an authorized "
        f"independent MRV verifier. High-integrity carbon credits have been successfully minted "
        f"to the registry ledger on the blockchain."
    )
    story.append(Paragraph(cert_text, body_style))
    story.append(Spacer(1, 20))

    # Grid details
    data = [
        [Paragraph("Project ID", label_style), Paragraph(project["id"], value_style)],
        [Paragraph("Ecosystem Type", label_style), Paragraph(project["ecosystem_type"].replace('_', ' ').title(), value_style)],
        [Paragraph("Restoration Area", label_style), Paragraph(f"{project['area_ha']:.2f} Hectares", value_style)],
        [Paragraph("Credits Issued (tCO2e)", label_style), Paragraph(f"{project['credits']:.2f} BCC (1 credit = 1 ton of CO2)", value_style)],
        [Paragraph("IPFS Evidence Hash", label_style), Paragraph(project["ipfs_hash"], value_style)],
        [Paragraph("On-chain Tx Hash", label_style), Paragraph(project["tx_hash"], value_style)],
        [Paragraph("Verifier Wallet", label_style), Paragraph(project["verifier_wallet"], value_style)],
        [Paragraph("Verification Date", label_style), Paragraph(project["decided_at"].strftime('%Y-%m-%d %H:%M UTC'), value_style)],
    ]

    t = Table(data, colWidths=[150, 382])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f4f9f9')),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d3d3d3')),
    ]))
    story.append(t)
    story.append(Spacer(1, 30))

    # Verification instructions text
    instructions_title = ParagraphStyle(
        'InstrTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#0f4c5c'),
        spaceAfter=5
    )
    instructions_body = ParagraphStyle(
        'InstrBody',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#666666')
    )
    story.append(Paragraph("Independent Verification Instructions:", instructions_title))
    story.append(Paragraph(
        "Anyone can audit this claim. 1) Copy the IPFS Hash and query it via any public IPFS gateway to inspect the raw satellite readings and computed vegetation values. "
        "2) Search the On-chain Tx Hash on the blockchain explorer to verify that the credits were minted transparently and cannot be double-spent. 3) Cross-reference the verifier wallet to ensure authorization.",
        instructions_body
    ))
    story.append(Spacer(1, 40))

    # Sign-off line
    sig_draw = Drawing(532, 20)
    sig_draw.add(Line(350, 10, 500, 10, strokeColor=colors.HexColor('#999999'), strokeWidth=1))
    sig_draw.add(String(370, 0, "Authorized Registry Admin", fontName="Helvetica-Oblique", fontSize=8, fillColor=colors.HexColor('#666666')))
    story.append(sig_draw)

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer
