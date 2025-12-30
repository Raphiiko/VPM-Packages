const LISTING_URL = "{{ listingInfo.Url }}";

const PACKAGES = {
{{~ for package in packages ~}}
  "{{ package.Name }}": {
    name: "{{ package.Name }}",
    displayName: "{{ if package.DisplayName; package.DisplayName; end; }}",
    description: `{{ if package.Description; package.Description; end; }}`,
    version: "{{ package.Version }}",
    author: {
      name: "{{ if package.Author.Name; package.Author.Name; end; }}",
      url: "{{ if package.Author.Url; package.Author.Url; end; }}",
    },
    dependencies: {
      {{~ for dependency in package.Dependencies ~}}
        "{{ dependency.Name }}": "{{ dependency.Version }}",
      {{~ end ~}}
    },
    keywords: [
      {{~ for keyword in package.Keywords ~}}
        "{{ keyword }}",
      {{~ end ~}}
    ],
    license: "{{ package.License }}",
    licensesUrl: "{{ package.LicensesUrl }}",
  },
{{~ end ~}}
};

// ============================================
// Search Functionality
// ============================================
(() => {
  const packageGrid = document.getElementById('packageGrid');
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', ({ target: { value = '' }}) => {
    const packageCards = packageGrid.querySelectorAll('.package-card');

    packageCards.forEach(card => {
      if (value === '') {
        card.style.display = 'flex';
        return;
      }

      const packageName = card.dataset?.packageName?.toLowerCase() || '';
      const packageId = card.dataset?.packageId?.toLowerCase() || '';
      const searchTerm = value.toLowerCase();

      if (packageName.includes(searchTerm) || packageId.includes(searchTerm)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
})();

// ============================================
// Add to VCC Buttons
// ============================================
(() => {
  // Main "Add to VCC" button
  const vccAddRepoButton = document.getElementById('vccAddRepoButton');
  if (vccAddRepoButton) {
    vccAddRepoButton.addEventListener('click', () => {
      window.location.assign(`vcc://vpm/addRepo?url=${encodeURIComponent(LISTING_URL)}`);
    });
  }

  // Package card "Add to VCC" buttons
  const rowAddToVccButtons = document.querySelectorAll('.rowAddToVccButton');
  rowAddToVccButtons.forEach((button) => {
    button.addEventListener('click', () => {
      window.location.assign(`vcc://vpm/addRepo?url=${encodeURIComponent(LISTING_URL)}`);
    });
  });
})();

// ============================================
// Copy URL Buttons
// ============================================
(() => {
  // Main URL copy button
  const vccUrlFieldCopy = document.getElementById('vccUrlFieldCopy');
  const vccUrlField = document.getElementById('vccUrlField');

  if (vccUrlFieldCopy && vccUrlField) {
    vccUrlFieldCopy.addEventListener('click', async () => {
      vccUrlField.select();
      try {
        await navigator.clipboard.writeText(vccUrlField.value);
        const originalHTML = vccUrlFieldCopy.innerHTML;
        vccUrlFieldCopy.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        `;
        vccUrlFieldCopy.classList.add('btn-primary');
        vccUrlFieldCopy.classList.remove('btn-secondary');

        setTimeout(() => {
          vccUrlFieldCopy.innerHTML = originalHTML;
          vccUrlFieldCopy.classList.remove('btn-primary');
          vccUrlFieldCopy.classList.add('btn-secondary');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }

  // Modal URL copy buttons
  const copyButtons = [
    { button: 'vccListingInfoUrlFieldCopy', field: 'vccListingInfoUrlField' },
    { button: 'packageInfoVccUrlFieldCopy', field: 'packageInfoVccUrlField' }
  ];

  copyButtons.forEach(({ button: buttonId, field: fieldId }) => {
    const button = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);

    if (button && field) {
      button.addEventListener('click', async () => {
        field.select();
        try {
          await navigator.clipboard.writeText(field.value);
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Copied!
          `;
          button.classList.add('btn-primary');
          button.classList.remove('btn-secondary');

          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    }
  });
})();

// ============================================
// Help Modal
// ============================================
(() => {
  const helpModal = document.getElementById('addListingToVccHelp');
  const urlBarHelp = document.getElementById('urlBarHelp');
  const helpModalClose = document.getElementById('addListingToVccHelpClose');
  const packageInfoListingHelp = document.getElementById('packageInfoListingHelp');

  if (urlBarHelp && helpModal) {
    urlBarHelp.addEventListener('click', () => {
      helpModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  }

  if (packageInfoListingHelp && helpModal) {
    packageInfoListingHelp.addEventListener('click', () => {
      helpModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  }

  if (helpModalClose && helpModal) {
    helpModalClose.addEventListener('click', () => {
      helpModal.hidden = true;
      document.body.style.overflow = '';
    });
  }

  // Close modal when clicking backdrop
  if (helpModal) {
    helpModal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      helpModal.hidden = true;
      document.body.style.overflow = '';
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal && !helpModal.hidden) {
      helpModal.hidden = true;
      document.body.style.overflow = '';
    }
  });
})();

// ============================================
// Package Info Modal
// ============================================
(() => {
  const packageInfoModal = document.getElementById('packageInfoModal');
  const packageInfoModalClose = document.getElementById('packageInfoModalClose');
  const rowPackageInfoButtons = document.querySelectorAll('.rowPackageInfoButton');

  const packageInfoName = document.getElementById('packageInfoName');
  const packageInfoId = document.getElementById('packageInfoId');
  const packageInfoVersion = document.getElementById('packageInfoVersion');
  const packageInfoDescription = document.getElementById('packageInfoDescription');
  const packageInfoAuthor = document.getElementById('packageInfoAuthor');
  const packageInfoDependencies = document.getElementById('packageInfoDependencies');
  const packageInfoKeywords = document.getElementById('packageInfoKeywords');
  const packageInfoKeywordsSection = document.getElementById('packageInfoKeywordsSection');
  const packageInfoLicense = document.getElementById('packageInfoLicense');
  const packageInfoLicenseSection = document.getElementById('packageInfoLicenseSection');

  rowPackageInfoButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const packageId = e.currentTarget.dataset?.packageId;
      const packageInfo = PACKAGES?.[packageId];

      if (!packageInfo) {
        console.error(`Package ${packageId} not found. Available packages:`, PACKAGES);
        return;
      }

      // Set package info
      packageInfoName.textContent = packageInfo.displayName || packageInfo.name;
      packageInfoId.textContent = packageId;
      packageInfoVersion.textContent = `v${packageInfo.version}`;
      packageInfoDescription.textContent = packageInfo.description || 'No description available';
      packageInfoAuthor.textContent = packageInfo.author.name || 'Unknown';
      packageInfoAuthor.href = packageInfo.author.url || '#';

      // Handle dependencies
      packageInfoDependencies.innerHTML = '';
      const deps = Object.entries(packageInfo.dependencies || {});

      if (deps.length === 0) {
        const noDepsItem = document.createElement('li');
        noDepsItem.textContent = 'No dependencies';
        noDepsItem.style.fontStyle = 'italic';
        packageInfoDependencies.appendChild(noDepsItem);
      } else {
        deps.forEach(([name, version]) => {
          const depItem = document.createElement('li');
          depItem.textContent = `${name} @ ${version}`;
          packageInfoDependencies.appendChild(depItem);
        });
      }

      // Handle keywords
      const keywords = packageInfo.keywords || [];
      if (keywords.length === 0 || (keywords.length === 1 && keywords[0] === '')) {
        packageInfoKeywordsSection.classList.add('hidden');
      } else {
        packageInfoKeywordsSection.classList.remove('hidden');
        packageInfoKeywords.innerHTML = '';
        keywords.forEach(keyword => {
          if (keyword) {
            const badge = document.createElement('div');
            badge.className = 'keyword-badge';
            badge.textContent = keyword;
            packageInfoKeywords.appendChild(badge);
          }
        });
      }

      // Handle license
      if (!packageInfo.license && !packageInfo.licensesUrl) {
        packageInfoLicenseSection.classList.add('hidden');
      } else {
        packageInfoLicenseSection.classList.remove('hidden');
        packageInfoLicense.textContent = packageInfo.license || 'See License';
        packageInfoLicense.href = packageInfo.licensesUrl || '#';
      }

      // Show modal
      packageInfoModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  if (packageInfoModalClose && packageInfoModal) {
    packageInfoModalClose.addEventListener('click', () => {
      packageInfoModal.hidden = true;
      document.body.style.overflow = '';
    });
  }

  // Close modal when clicking backdrop
  if (packageInfoModal) {
    packageInfoModal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      packageInfoModal.hidden = true;
      document.body.style.overflow = '';
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && packageInfoModal && !packageInfoModal.hidden) {
      packageInfoModal.hidden = true;
      document.body.style.overflow = '';
    }
  });
})();

// ============================================
// Context Menu
// ============================================
(() => {
  const rowMoreMenu = document.getElementById('rowMoreMenu');
  const rowMenuButtons = document.querySelectorAll('.rowMenuButton');
  const rowMoreMenuDownload = document.getElementById('rowMoreMenuDownload');

  let currentPackageUrl = null;

  const hideContextMenu = () => {
    if (rowMoreMenu) {
      rowMoreMenu.hidden = true;
    }
  };

  rowMenuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();

      currentPackageUrl = e.currentTarget.dataset?.packageUrl;

      if (rowMoreMenu) {
        // Position the menu near the button
        const rect = e.currentTarget.getBoundingClientRect();
        rowMoreMenu.style.top = `${rect.bottom + 5}px`;
        rowMoreMenu.style.left = `${rect.right - 180}px`;
        rowMoreMenu.hidden = false;

        // Add click listener to close menu
        setTimeout(() => {
          document.addEventListener('click', hideContextMenu, { once: true });
        }, 10);
      }
    });
  });

  if (rowMoreMenuDownload) {
    rowMoreMenuDownload.addEventListener('click', () => {
      if (currentPackageUrl) {
        window.open(currentPackageUrl, '_blank');
        hideContextMenu();
      }
    });
  }
})();

// ============================================
// Tabs
// ============================================
(() => {
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');

  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Deactivate all
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activate clicked
        tab.classList.add('active');
        const contentId = `tab-${tab.dataset.tab}`;
        const content = document.getElementById(contentId);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  }
})();

// ============================================
// Initialize
// ============================================
console.log('VPM Package Listing loaded');
console.log(`Packages available: ${Object.keys(PACKAGES).length}`);
