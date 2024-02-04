import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import user from '../images/user/user-01.png';
// import { Preview, print } from 'react-html2pdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
const ContractEditor = () => {
  const [content, setContent] = useState<string>('');
  const contentRef = useRef<any>();
  const maxWords = 1000; // Set your desired maximum number of words

  // Function to strip HTML tags from a string
  const stripHtmlTags = (html: any) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleChange = (value: any) => {
    const plainTextContent = stripHtmlTags(value);
    // Split the plain text content into words
    const words = plainTextContent.trim().split(/\s+/);
    console.log('aal', words);

    if (words.length > maxWords) {
      // Truncate the content to the maximum number of words
      toast.error('Max Words Reached , Further Text Will Not Be Added');
      // const truncatedContent = words.slice(0, maxWords).join(' ');
      // setContent(truncatedContent);
    } else {
      setContent(value);
    }
  };
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // basic text formatting
    [{ align: [] }], // alignment options
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6] }], // heading options
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['clean'],
  ];
  const handleGetText2 = async () => {
    try {
      let iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      let iframedoc = iframe.contentDocument || iframe.contentWindow?.document!;
      iframedoc.body.innerHTML = content;

      const pageWidth = 595; // A4 width in pixels
      const pageHeight = 842; // A4 height in pixels
      const margin = 10;

      // Calculate the number of pages based on content height
      let totalHeight = iframedoc.body.scrollHeight;
      let pages = Math.ceil(totalHeight / (pageHeight - margin));

      // Create a PDF document
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px',
      });

      // Loop through each page and add it to the PDF
      for (let i = 0; i < pages; i++) {
        const startY = i * (pageHeight - margin);
        let canvas = await html2canvas(iframedoc.body, {
          windowWidth: iframedoc.body.scrollWidth,
          windowHeight: iframedoc.body.scrollHeight,
          x: 0,
          y: startY,
          width: pageWidth,
          height: pageHeight - margin,
        });

        // Convert the canvas to an image
        let imgData = canvas.toDataURL('image/png');

        // Add the image as a page to the PDF
        if (i > 0) {
          doc.addPage(); // Add a new page for subsequent pages
        }
        doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
      }

      // Save the PDF
      doc.save('Sample');
    } catch (e) {
      console.error(e);
    }
  };
  const handleGetText = () => {
    const options = {
      filename: 'my-document.pdf',
      margin: 10, // Adjust the margin to give some space at the edges
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 }, // Adjust the scale factor
      jsPDF: {
        unit: 'mm', // Change the unit to millimeters
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: 'avoid-all' },
    };
    html2pdf()
      .set(options)
      .from(contentRef.current.innerHTML)
      .output('dataurlnewwindow', {
        // Output PDF directly with custom margins
        margin: { top: 20, right: 10, bottom: 20, left: 10 }, // Adjust individual margins
      });
  };

  return (
    <>
      <div>
        <ReactQuill
          theme="snow" // or 'bubble' for a different theme
          value={content}
          onChange={handleChange}
          className="h-100 mb-20"
          modules={{ toolbar: toolbarOptions }}
        />
        {/* <Preview id={'jsx-template'} template={content}>
          Thanks
        </Preview> */}
        <section ref={contentRef}>
          <img src={user} />
          <div
            className="ql-editor"
            id="div-tToPrint"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>

        <button onClick={handleGetText}> Downlaod</button>
      </div>
    </>
  );
};

export default ContractEditor;
