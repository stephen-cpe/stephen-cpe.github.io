let currentCertificateIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = new Lightbox('lightbox', 'lightboxClose', 'lightboxImage', 'certificateDetailsContent');

    loadCertificates(lightbox);
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterCertificates);
    
    document.getElementById('closeDetails').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('certificateDetails').classList.add('hidden');
    });

    document.getElementById('prevCertificate').addEventListener('click', function(e) {
        e.stopPropagation();
        navigateCertificate(-1, lightbox);
    });

    document.getElementById('nextCertificate').addEventListener('click', function(e) {
        e.stopPropagation();
        navigateCertificate(1, lightbox);
    });

    document.addEventListener('keydown', function(e) {
        if (lightbox.active) {
            if (e.key === 'ArrowRight') {
                navigateCertificate(1, lightbox);
            } else if (e.key === 'ArrowLeft') {
                navigateCertificate(-1, lightbox);
            }
        }
    });
});

function loadCertificates(lightbox) {
    const certificatesGrid = document.getElementById('certificatesGrid');
    certificatesGrid.innerHTML = '';
    
    if (typeof certificatesData !== 'undefined' && certificatesData.length > 0) {
        certificatesData.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'certificate-card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <img src="certificates/${cert.filename}" alt="${cert.name}" class="certificate-image" loading="lazy">
                <div class="certificate-name">${cert.name}</div>
            `;
            
            card.addEventListener('click', function() {
                showCertificate(index, lightbox);
            });
            
            certificatesGrid.appendChild(card);
        });
    } else {
        certificatesGrid.innerHTML = '<div class="no-results">No certificates found</div>';
    }
}

function showCertificate(index, lightbox) {
    if (index < 0 || index >= certificatesData.length) return;
    
    currentCertificateIndex = index;
    const cert = certificatesData[index];
    
    lightbox.show(cert);
    document.getElementById('certificateDetails').classList.remove('hidden');
}

function navigateCertificate(direction, lightbox) {
    const total = certificatesData.length;
    if (total === 0) return;
    
    let newIndex = currentCertificateIndex + direction;
    
    if (newIndex >= total) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = total - 1;
    }
    
    showCertificate(newIndex, lightbox);
}

function filterCertificates() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        const index = card.dataset.index;
        const cert = certificatesData[index];
        
        const matches = 
            cert.name.toLowerCase().includes(searchTerm) || 
            cert.issuer.toLowerCase().includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
    });
}
