#!/usr/bin/env python3
"""
Convert MOBU Markdown documents to PDF
"""
import sys
import markdown
from weasyprint import HTML, CSS
from pathlib import Path

def markdown_to_pdf(md_file, pdf_file=None):
    """Convert Markdown file to PDF with styling"""
    
    # Read markdown content
    md_path = Path(md_file)
    if not md_path.exists():
        print(f"Error: File {md_file} not found")
        return False
    
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown.markdown(
        md_content,
        extensions=['tables', 'fenced_code', 'codehilite', 'toc']
    )
    
    # Add CSS styling
    css_style = """
    @page {
        size: A4;
        margin: 2cm;
        @top-center {
            content: "MOBU Investment Platform";
            font-size: 10pt;
            color: #666;
        }
        @bottom-right {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 9pt;
            color: #666;
        }
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        max-width: 100%;
    }
    
    h1 {
        color: #1a73e8;
        font-size: 24pt;
        margin-top: 20pt;
        margin-bottom: 10pt;
        border-bottom: 2px solid #1a73e8;
        padding-bottom: 5pt;
        page-break-after: avoid;
    }
    
    h2 {
        color: #1a73e8;
        font-size: 18pt;
        margin-top: 16pt;
        margin-bottom: 8pt;
        page-break-after: avoid;
    }
    
    h3 {
        color: #5f6368;
        font-size: 14pt;
        margin-top: 12pt;
        margin-bottom: 6pt;
        page-break-after: avoid;
    }
    
    h4 {
        color: #5f6368;
        font-size: 12pt;
        margin-top: 10pt;
        margin-bottom: 5pt;
        page-break-after: avoid;
    }
    
    p {
        margin-bottom: 10pt;
        text-align: justify;
    }
    
    ul, ol {
        margin-bottom: 10pt;
        padding-left: 25pt;
    }
    
    li {
        margin-bottom: 5pt;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15pt 0;
        font-size: 10pt;
        page-break-inside: avoid;
    }
    
    th {
        background-color: #1a73e8;
        color: white;
        padding: 8pt;
        text-align: left;
        font-weight: bold;
    }
    
    td {
        border: 1px solid #ddd;
        padding: 8pt;
    }
    
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    
    code {
        background-color: #f5f5f5;
        padding: 2pt 4pt;
        border-radius: 3pt;
        font-family: "Monaco", "Courier New", monospace;
        font-size: 9pt;
        color: #d73a49;
    }
    
    pre {
        background-color: #f6f8fa;
        border: 1px solid #ddd;
        border-radius: 5pt;
        padding: 10pt;
        overflow-x: auto;
        margin: 10pt 0;
        page-break-inside: avoid;
    }
    
    pre code {
        background-color: transparent;
        padding: 0;
        color: #24292e;
        font-size: 9pt;
    }
    
    blockquote {
        border-left: 4pt solid #1a73e8;
        padding-left: 15pt;
        margin-left: 0;
        color: #666;
        font-style: italic;
    }
    
    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 20pt 0;
    }
    
    a {
        color: #1a73e8;
        text-decoration: none;
    }
    
    a:hover {
        text-decoration: underline;
    }
    
    .page-break {
        page-break-before: always;
    }
    
    /* Prevent orphans and widows */
    p, li {
        orphans: 3;
        widows: 3;
    }
    
    /* Keep headings with following content */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
    }
    """
    
    # Wrap HTML with proper structure
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{md_path.stem}</title>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Determine output file name
    if pdf_file is None:
        pdf_file = md_path.with_suffix('.pdf')
    
    # Convert to PDF
    try:
        HTML(string=full_html).write_pdf(
            pdf_file,
            stylesheets=[CSS(string=css_style)]
        )
        print(f"✅ Successfully created: {pdf_file}")
        return True
    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_to_pdf.py <markdown_file> [output_pdf]")
        print("\nExample:")
        print("  python convert_to_pdf.py MOBU_Competitive_Analysis.md")
        print("  python convert_to_pdf.py MOBU_Competitive_Analysis.md output.pdf")
        sys.exit(1)
    
    md_file = sys.argv[1]
    pdf_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = markdown_to_pdf(md_file, pdf_file)
    sys.exit(0 if success else 1)
