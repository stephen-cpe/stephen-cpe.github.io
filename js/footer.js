// Renders the site footer from the links defined in data/footer-links.js.
// footer.html supplies the <footer class="site-footer"> shell; its links are
// always generated here so the list is never duplicated.

function renderFooterLinks() {
    if (typeof footerLinks === 'undefined') {
        console.error('footerLinks is undefined: data/footer-links.js failed to load');
        return '';
    }

    const pathname = window.location.pathname;

    return footerLinks
        .filter(link => (!link.showOn || pathname.endsWith(link.showOn)) &&
                        (!link.hideOn || !pathname.endsWith(link.hideOn)))
        .map(link => {
            const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${link.href}"${target}>${link.label}</a>`;
        })
        .join(' |\n    ');
}

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
        .then(template => {
            const parsed = new DOMParser().parseFromString(template, 'text/html');
            const footer = parsed.querySelector('.site-footer');
            if (footer) {
                footer.innerHTML = renderFooterLinks();
            }
            footerContainer.innerHTML = parsed.body.innerHTML;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation: ' + error);
            footerContainer.innerHTML = `
    <footer class="site-footer">
        ${renderFooterLinks()}
    </footer>
`;
        });
});
