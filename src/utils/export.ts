import jsPDF from 'jspdf';

export async function exportToPNG(element: HTMLElement, filename: string = 'matrice-risques'): Promise<void> {
  // Dynamically import html-to-image which handles modern CSS better
  const { toPng } = await import('html-to-image');
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      skipFonts: true,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Export PNG error:', error);
    // Fallback: use canvas API
    await fallbackExport(element, filename, 'png');
  }
}

export async function exportToPDF(element: HTMLElement, filename: string = 'matrice-risques'): Promise<void> {
  const { toPng } = await import('html-to-image');
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      skipFonts: true,
    });
    
    // Create image to get dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width / 2, img.height / 2],
    });
    
    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 2, img.height / 2);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Export PDF error:', error);
    await fallbackExport(element, filename, 'pdf');
  }
}

async function fallbackExport(element: HTMLElement, filename: string, type: 'png' | 'pdf'): Promise<void> {
  // Create a canvas manually as fallback
  const canvas = document.createElement('canvas');
  const rect = element.getBoundingClientRect();
  const scale = 2;
  
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Convert element to SVG data URL
  const data = new XMLSerializer().serializeToString(element);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width * scale}" height="${rect.height * scale}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${element.outerHTML}</div>
    </foreignObject>
  </svg>`;
  
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    
    if (type === 'png') {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${filename}.pdf`);
    }
  };
  img.src = url;
}
