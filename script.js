const button = document.getElementById('download-button');

    function generatePDF() {
      const outputwindow = document.getElementById('outputpreview');
      // element which has to be printed 
      html2pdf().from(outputwindow).save();
    }
    button.addEventListener('click', generatePDF);