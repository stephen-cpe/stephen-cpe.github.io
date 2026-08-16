document.addEventListener('DOMContentLoaded', function() {
    const msseContainer = document.getElementById('msse-progress-container');
    if (msseContainer) {
        renderCourses(msseContainer, mssceCourses, true);
    }

    const specializationsContainer = document.getElementById('specializations-container');
    if (specializationsContainer) {
        // Exclude incomplete specialization (STATISTICS FOR SOFTWARE ENGINEERING SPECIALIZATION)
        const displayedSpecializations = specializations.filter(s => s.title !== 'STATISTICS FOR SOFTWARE ENGINEERING SPECIALIZATION');
        renderCourses(specializationsContainer, displayedSpecializations, true);
    }

    const otherContainer = document.getElementById('other-courses-container');
    if (otherContainer) {
        renderCourses(otherContainer, otherCourses, false);
    }

    const professionalCertsContainer = document.getElementById('professional-certifications-container');
    if (professionalCertsContainer) {
        renderProfessionalCertifications(professionalCertsContainer);
    }

    const lightbox = new Lightbox('certificateLightbox', 'lightboxClose', 'lightboxImage', 'certificateDetailsContent');

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('certificate-link')) {
            e.preventDefault();
            const certName = e.target.getAttribute('data-cert-name');
            const cert = certificatesData.find(c => c.name === certName);
            if (cert) {
                lightbox.show(cert);
            }
        }
    });
});

function renderCourses(container, courseData, isMSSE) {
    courseData.forEach(section => {
        const sectionElement = document.createElement(isMSSE ? 'details' : 'div');
        if (isMSSE) {
            sectionElement.className = 'course-section';
            // Calculate progress to determine if section should be open
            const completedCount = section.courses.filter(c => c.status === 'complete').length;
            const totalCount = section.courses.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            // Only keep sections that are NOT 100% complete open by default
            sectionElement.open = progress < 100;
        }

        const titleElement = document.createElement(isMSSE ? 'summary' : 'h3');
        titleElement.textContent = section.title || section.platform;
        sectionElement.appendChild(titleElement);

        const contentWrapper = isMSSE ? document.createElement('div') : sectionElement;
        if (isMSSE) {
            contentWrapper.className = 'details-content';
            sectionElement.appendChild(contentWrapper);
        }

        const completedCount = section.courses.filter(c => c.status === 'complete').length;
        const totalCount = section.courses.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        if (isMSSE) {
            sectionElement.dataset.progress = progress;
            titleElement.textContent += ` (${Math.round(progress)}%)`;
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
            progressBarContainer.appendChild(progressBar);
            contentWrapper.appendChild(progressBarContainer);
        }

        const ul = document.createElement('ul');
        section.courses.forEach(course => {
            const li = document.createElement('li');
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${course.status}`;
            statusSpan.textContent = course.status === 'complete' ? '✓' : '●';
            li.appendChild(statusSpan);

            if (course.certificate) {
                const anchor = document.createElement('a');
                anchor.href = '#';
                anchor.className = 'certificate-link';
                anchor.dataset.certName = course.certificate.name;
                anchor.textContent = ` ${course.name}`;
                li.appendChild(anchor);
            } else {
                li.innerHTML += ` ${course.name}`;
            }
            ul.appendChild(li);
        });
        contentWrapper.appendChild(ul);
        container.appendChild(sectionElement);
    });
}

function renderProfessionalCertifications(container) {
    const professionalCertNames = [
        "Master of Science in Software Engineering",
        "AWS Certified Cloud Practitioner",
        "AWS Certified AI Practitioner"
    ];
    const professionalCerts = certificatesData.filter(cert => professionalCertNames.includes(cert.name));

    professionalCerts.forEach(cert => {
        const certItem = document.createElement('div');
        certItem.className = 'certificate-item';
        if (cert.isDegree) {
            certItem.classList.add('degree-item');
        }

        const certTitle = document.createElement('p');
        certTitle.className = 'certificate-title';

        const certLink = document.createElement('a');
        certLink.href = '#';
        certLink.className = 'certificate-link';
        certLink.dataset.certName = cert.name;
        certLink.textContent = cert.name;

        certTitle.appendChild(certLink);
        certItem.appendChild(certTitle);

        if (cert.credlyUrl) {
            const credlyLink = document.createElement('a');
            credlyLink.href = cert.credlyUrl;
            credlyLink.target = '_blank';
            credlyLink.rel = 'noopener noreferrer';
            credlyLink.className = 'credly-link';
            credlyLink.textContent = 'View on Credly';
            certItem.appendChild(credlyLink);
        }

        if (cert.parchmentUrl) {
            const parchmentLink = document.createElement('a');
            parchmentLink.href = cert.parchmentUrl;
            parchmentLink.target = '_blank';
            parchmentLink.rel = 'noopener noreferrer';
            parchmentLink.className = 'parchment-link';
            parchmentLink.textContent = 'View on Parchment';
            certItem.appendChild(parchmentLink);
        }

        container.appendChild(certItem);
    });
}
