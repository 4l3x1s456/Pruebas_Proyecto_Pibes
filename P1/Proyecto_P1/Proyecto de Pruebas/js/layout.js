document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadSidebar();
    loadFooter();

    // Initialize sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Move content inside wrapper
    if (content) {
        content.parentNode.insertBefore(wrapper, content);
        wrapper.appendChild(content);
    }

    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container';
    document.body.insertBefore(pageContainer, document.body.firstChild);
    pageContainer.appendChild(wrapper);

    if (sidebarToggle && sidebar) {
        // Check for saved state
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            content.classList.add('expanded');
        }

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
            // Save state
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }

    // Handle responsive behavior
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            content.classList.add('expanded');
        } else {
            const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (!sidebarCollapsed) {
                sidebar.classList.remove('collapsed');
                content.classList.remove('expanded');
            }
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
});