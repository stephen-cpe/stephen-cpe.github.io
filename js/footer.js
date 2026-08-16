document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.createElement('div');
    footerContainer.id = 'footer-container';
    document.body.appendChild(footerContainer);

    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            if (document.getElementById('footer-container')) {
                // On certificates.html, swap CERTIFICATES link for HOME link
                let footerContent = data;
                if (window.location.pathname.endsWith('certificates.html')) {
                    footerContent = footerContent.replace('<a href="certificates.html">CERTIFICATES</a>', '<a href="index.html">HOME</a>');
                }
                document.getElementById('footer-container').innerHTML = footerContent;
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation: error');
            const fallbackFooter = document.createElement('footer');
            fallbackFooter.className = 'site-footer';
            let fallbackContent = `
    <a href="https://github.com/stephen-cpe/study-and-learn" target="_blank">PROJECT 1</a> |
    <a href="https://github.com/stephen-cpe/notebook-project" target="_blank">PROJECT 2</a> |
    <a href="https://github.com/stephen-cpe/inventory_management_system" target="_blank">PROJECT 3</a> |
    <a href="https://github.com/stephen-cpe/eternal_fusion_pavilion" target="_blank">PROJECT 4</a> |
    <a href="#">PROJECT 5</a> |
    <a href="https://github.com/stephen-cpe/meteoric-garden-shop-v4" target="_blank">PROJECT 6</a> |
    <a href="certificates.html">CERTIFICATES</a> |
    <a href="https://stephen-cpe.github.io/web-tools/" target="_blank">WEB TOOLS</a>
`;
            if (window.location.pathname.endsWith('certificates.html')) {
                fallbackContent = fallbackContent.replace('<a href="certificates.html">CERTIFICATES</a>', '<a href="index.html">HOME</a>');
            }
            fallbackFooter.innerHTML = fallbackContent;
            document.body.appendChild(fallbackFooter);
        });
});