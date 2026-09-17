#!/usr/bin/env python3
"""
Generate PDF from MOBU Competitive Analysis Markdown
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
import re

def parse_markdown_to_pdf(md_file, pdf_file):
    """Convert markdown file to PDF with proper formatting"""
    
    # Read markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create PDF
    doc = SimpleDocTemplate(
        pdf_file,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )
    
    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )
    
    h3_style = ParagraphStyle(
        'CustomH3',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#374151'),
        spaceAfter=8,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['BodyText'],
        fontSize=10,
        leading=14,
        leftIndent=20,
        spaceAfter=4
    )
    
    # Split content into lines
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            elements.append(Spacer(1, 6))
            i += 1
            continue
        
        # Title (first H1)
        if line.startswith('# ') and i < 5:
            text = line[2:].strip()
            elements.append(Paragraph(text, title_style))
            elements.append(Spacer(1, 12))
            i += 1
            continue
        
        # H1
        if line.startswith('# '):
            text = line[2:].strip()
            elements.append(Paragraph(text, h1_style))
            i += 1
            continue
        
        # H2
        if line.startswith('## '):
            text = line[3:].strip()
            # Remove emoji if present
            text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text).strip()
            elements.append(Paragraph(text, h2_style))
            i += 1
            continue
        
        # H3
        if line.startswith('### '):
            text = line[4:].strip()
            # Remove emoji if present
            text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text).strip()
            elements.append(Paragraph(text, h3_style))
            i += 1
            continue
        
        # H4
        if line.startswith('#### '):
            text = line[5:].strip()
            text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text).strip()
            elements.append(Paragraph(f"<b>{text}</b>", body_style))
            i += 1
            continue
        
        # Horizontal rule
        if line.startswith('---'):
            elements.append(Spacer(1, 12))
            i += 1
            continue
        
        # Bullet points
        if line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
            # Remove emoji
            text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text).strip()
            # Handle bold and links
            text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
            text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
            elements.append(Paragraph(f"• {text}", bullet_style))
            i += 1
            continue
        
        # Tables
        if line.startswith('| '):
            # Collect table rows
            table_rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                row = lines[i].strip()
                # Skip separator rows
                if '---' in row:
                    i += 1
                    continue
                # Parse row
                cells = [cell.strip() for cell in row.split('|')[1:-1]]
                # Remove markdown formatting
                cells = [re.sub(r'\*\*([^*]+)\*\*', r'\1', cell) for cell in cells]
                cells = [re.sub(r'[\U0001F300-\U0001F9FF]', '', cell).strip() for cell in cells]
                cells = [re.sub(r'[✅❌]', '', cell).strip() for cell in cells]
                table_rows.append(cells)
                i += 1
            
            if table_rows:
                # Create table
                t = Table(table_rows, hAlign='LEFT')
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 9),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                elements.append(t)
                elements.append(Spacer(1, 12))
            continue
        
        # Regular paragraphs
        text = line
        # Remove emoji
        text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text).strip()
        # Handle bold
        text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
        # Handle links
        text = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', text)
        # Handle inline code
        text = re.sub(r'`([^`]+)`', r'<font name="Courier">\1</font>', text)
        
        if text:
            elements.append(Paragraph(text, body_style))
        i += 1
    
    # Build PDF
    doc.build(elements)
    print(f"✅ PDF generated: {pdf_file}")

if __name__ == '__main__':
    md_file = '/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/MOBU_Competitive_Analysis.md'
    pdf_file = '/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/MOBU_Competitive_Analysis.pdf'
    
    parse_markdown_to_pdf(md_file, pdf_file)
