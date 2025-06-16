document.addEventListener("DOMContentLoaded", () => {
    // =======================================================
    // 1. CORE DATA & AUTHENTICATION FUNCTIONS
    // =======================================================
    const getUsers = () => {
        const storedUsers = localStorage.getItem('byd_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            const initialUsers = {
                admin: { password: 'admin', role: 'admin' },
                user: { password: 'user', role: 'user' }
            };
            localStorage.setItem('byd_users', JSON.stringify(initialUsers));
            return initialUsers;
        }
    };
    const saveUsers = (users) => localStorage.setItem('byd_users', JSON.stringify(users));

    const getCars = () => {
        const cars = localStorage.getItem('byd_cars');
        if (cars) {
            return JSON.parse(cars);
        } else {
            const initialCars = [
                { id: 1, name: 'Yangwang U9', type: 'Electric Supercar', year: 2024, image: 'img/car1.jpg', description: 'A hypercar that can dance. Features the revolutionary DiSus-X body control system.', specs: { range: '450 km', power: '1,100 hp', '0-100km/h': '2.3s' } },
                { id: 2, name: 'BYD Han', type: 'Flagship Sedan', year: 2023, image: 'img/car2.jpg', description: 'A masterpiece of design and performance, combining luxury with cutting-edge EV technology.', specs: { range: '610 km', power: '510 hp', '0-100km/h': '3.9s' } },
                { id: 3, name: 'BYD Blade Battery', type: 'Energy Solution', year: 2020, image: 'img/byd-battery.jpeg', description: 'A revolution in battery safety and energy density, setting new industry standards.', specs: { range: 'N/A', power: 'N/A', '0-100km/h': 'N/A' } },
                { id: 4, name: 'BYD Electric Bus', type: 'Public Transport', year: 2021, image: 'img/BYD-BUS.jpeg', description: 'Our zero-emission bus, leading the charge in electrifying public transport globally.', specs: { range: '250 km', power: '402 hp', '0-100km/h': 'N/A' } },
                { id: 5, name: 'Denza D9', type: 'Luxury MPV', year: 2023, image: 'img/denza-d9.jpeg', description: 'The pinnacle of comfort and space, designed for the ultimate family and executive travel experience.', specs: { range: '600 km', power: '400 hp', '0-100km/h': '6.9s' } },
                { id: 6, name: 'BYD Sea Lion 07', type: 'Mid-size SUV', year: 2024, image: 'img/sea-lion-07.jpg', description: 'A dynamic and stylish all-electric SUV built on our advanced e-Platform 3.0 Evo.', specs: { range: '550 km', power: '522 hp', '0-100km/h': '3.8s' } }
            ];
            localStorage.setItem('byd_cars', JSON.stringify(initialCars));
            return initialCars;
        }
    };
    const saveCars = (cars) => localStorage.setItem('byd_cars', JSON.stringify(cars));

    const getFavorites = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return [];
        const favorites = localStorage.getItem(`favorites_${user.username}`);
        return favorites ? JSON.parse(favorites) : [];
    };
    const saveFavorites = (favorites) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;
        localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    };

    const getComments = () => {
        const comments = localStorage.getItem('byd_comments');
        return comments ? JSON.parse(comments) : {};
    };

    const saveComments = (comments) => {
        localStorage.setItem('byd_comments', JSON.stringify(comments));
    };

    const getNews = () => {
        const news = localStorage.getItem('byd_news');
        if (news) {
            return JSON.parse(news);
        } else {
            const initialNews = [
                { id: 1, title: 'BYD Launches a New Era with the Revolutionary Blade Battery', date: '2024-03-15', author: 'BYD Official', image: 'img/byd-battery.jpeg', content: 'Today marks a significant milestone in the electric vehicle industry. BYD has officially launched its groundbreaking Blade Battery, a development set to redefine safety standards for EVs globally. The Blade Battery has undergone extreme testing, including nail penetration tests, without emitting smoke or fire. Its unique array structure also increases space utilization by over 50% compared to traditional battery packs, promising longer ranges and a safer, more sustainable future for everyone.' },
                { id: 2, title: 'The Yangwang U9: More Than a Supercar, It Can Dance', date: '2024-02-25', author: 'EV Weekly', image: 'img/car1.jpg', content: 'BYD\'s luxury sub-brand, Yangwang, has stolen the show with the U9, a supercar that defies convention. Powered by four independent electric motors, the U9 boasts over 1,100 horsepower. But its party trick is the DiSus-X body control system, which allows the car to drive with only three wheels, jump, and even perform a "dance." This isn\'t just a gimmick; it\'s a demonstration of unprecedented control and stability, heralding a new level of performance technology for electric vehicles.' },
                { id: 3, title: 'Sea Lion 07 Officially Hits the Market, Starting at $26,000', date: '2024-05-10', author: 'Auto Insights', image: 'img/sea-lion-07.jpg', content: 'The highly anticipated BYD Sea Lion 07 is now available, and it\'s poised to shake up the mid-size electric SUV market. Built on the new e-Platform 3.0 Evo, the Sea Lion 07 offers a sleek design, advanced driver-assistance systems, and impressive performance specs. With a starting price equivalent to just $26,000, it offers a compelling package of style, technology, and value that competitors will find hard to match.' }
            ];
            localStorage.setItem('byd_news', JSON.stringify(initialNews));
            return initialNews;
        }
    };
    const saveNews = (news) => localStorage.setItem('byd_news', JSON.stringify(news));

    // === KODE BARU YANG SUDAH DIPERBAIKI ===
    const getComparisonList = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        // Tentukan kunci penyimpanan: unik jika login, global jika tidak.
        const key = user ? `comparison_${user.username}` : 'byd_comparison_guest';
        const comparison = localStorage.getItem(key);
        return comparison ? JSON.parse(comparison) : [];
    };

    const saveComparisonList = (list) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        // Tentukan kunci penyimpanan: unik jika login, global jika tidak.
        const key = user ? `comparison_${user.username}` : 'byd_comparison_guest';
        localStorage.setItem(key, JSON.stringify(list));
    };

    // =======================================================
    // 2. REUSABLE COMPONENTS & LOGIC
    // =======================================================
    let applyFiltersAndSort; 
    let renderCompareBar; // Make this globally accessible

    const toggleCompare = (carId) => {
        let comparisonList = getComparisonList();
        const carIdNum = parseInt(carId);

        const carIndex = comparisonList.indexOf(carIdNum);
        if (carIndex > -1) {
            comparisonList.splice(carIndex, 1); // Remove from list
        } else {
            if (comparisonList.length >= 4) {
                alert('You can only compare up to 4 models at a time.');
                return false; // Indicate failure
            }
            comparisonList.push(carIdNum); // Add to list
        }
        saveComparisonList(comparisonList);
        return true; // Indicate success
    };

    // FIX: Simplified toggleFavorite to only manage data and trigger a re-render.
    const toggleFavorite = (carId) => {
        let favorites = getFavorites();
        const carIdNum = parseInt(carId);
        if (favorites.includes(carIdNum)) {
            favorites = favorites.filter(id => id !== carIdNum);
        } else {
            favorites.push(carIdNum);
        }
        saveFavorites(favorites);
        if (applyFiltersAndSort) {
            applyFiltersAndSort(); // Re-render the main grid to update heart icon
        }
    };

    const addComment = (carId, text) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) { alert('You must be logged in to comment.'); return; }
        if (!text.trim()) { alert('Comment cannot be empty.'); return; }

        const allComments = getComments();
        if (!allComments[carId]) allComments[carId] = [];
        
        allComments[carId].push({
            username: currentUser.username,
            text: text,
            date: new Date().toISOString()
        });
        saveComments(allComments);

        const commentsList = document.getElementById('modal-comments-list');
        renderCommentsList(carId, commentsList); // Refresh only the comments list
        
        const commentTextArea = document.getElementById('comment-text');
        if (commentTextArea) commentTextArea.value = '';
    };

    const deleteComment = (carId, commentDate) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') { alert('You do not have permission to delete comments.'); return; }
        if (!confirm('Are you sure you want to delete this comment?')) return;

        const allComments = getComments();
        if (allComments[carId]) {
            allComments[carId] = allComments[carId].filter(comment => comment.date !== commentDate);
            if (allComments[carId].length === 0) delete allComments[carId];
            
            saveComments(allComments);
            const commentsList = document.getElementById('modal-comments-list');
            renderCommentsList(carId, commentsList); // Refresh only the comments list
            alert('Comment deleted successfully.');
        }
    };

    // FIX: renderCarGrid now correctly includes the "Compare" checkbox and adjusts modal triggers.
    const renderCarGrid = (carsToRender, targetElement) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const favorites = getFavorites();
        const comparisonList = getComparisonList();

        if (!targetElement) return;

        if (carsToRender.length === 0) {
            targetElement.innerHTML = `<p class="text-center w-100 p-5">No models match your criteria.</p>`;
            return;
        }

        targetElement.innerHTML = carsToRender.map(car => {
            const isFavorite = favorites.includes(car.id);
            const favoriteIconHTML = currentUser ? `<span class="favorite-icon ${isFavorite ? 'is-favorite' : ''}" data-id="${car.id}"><i class="fas fa-heart"></i></span>` : '';
            
            const isCompared = comparisonList.includes(car.id);
            const compareCheckboxHTML = `
                <div class="compare-checkbox-container">
                    <input type="checkbox" class="compare-checkbox" id="compare-${car.id}" data-id="${car.id}" ${isCompared ? 'checked' : ''}>
                    <label for="compare-${car.id}">Compare</label>
                </div>
            `;

            return `
                <div class="car-card" data-car-id="${car.id}">
                    ${favoriteIconHTML}
                    <img src="${car.image}" alt="${car.name}" class="card-img" data-bs-toggle="modal" data-bs-target="#carDetailModal">
                    <div class="card-body" data-bs-toggle="modal" data-bs-target="#carDetailModal">
                        <h4>${car.name}</h4>
                        <div class="card-subtitle">${car.type} - ${car.year}</div>
                        <p>${car.description}</p>
                    </div>
                    ${compareCheckboxHTML}
                </div>`;
        }).join('');
    };

    const renderCommentsList = (carId, commentsListElement) => {
        const allComments = getComments();
        const carComments = allComments[carId] || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!commentsListElement) return;
        
        if (carComments.length > 0) {
            commentsListElement.innerHTML = carComments.sort((a,b) => new Date(b.date) - new Date(a.date)).map(comment => { // Sort by newest first
                const isAdmin = currentUser && currentUser.role === 'admin';
                const deleteButtonHTML = isAdmin ? `<button class="btn btn-sm btn-outline-danger delete-comment-btn" data-car-id="${carId}" data-comment-date="${comment.date}"><i class="fas fa-trash-alt"></i></button>` : '';
                return `<div class="comment-item"><div class="d-flex justify-content-between align-items-start"><div><strong>${comment.username}</strong> <small class="text-muted ms-2">${new Date(comment.date).toLocaleString()}</small><p class="mb-0">${comment.text}</p></div>${deleteButtonHTML}</div></div>`;
            }).join('');
        } else {
            commentsListElement.innerHTML = '<p>No comments yet. Be the first to share your thoughts!</p>';
        }
    };
    
    // FIX: Moved renderCompareBar to the main script scope so it's globally accessible.
    renderCompareBar = () => {
        const compareBarContainer = document.getElementById('compare-bar-container');
        if (!compareBarContainer) return;

        const comparisonList = getComparisonList();
        const allCarsForCompare = getCars();

        if (comparisonList.length === 0) {
            compareBarContainer.innerHTML = '';
            compareBarContainer.classList.remove('visible');
            return;
        }

        const selectedCars = comparisonList.map(id => allCarsForCompare.find(c => c.id === id)).filter(Boolean); // .filter(Boolean) handles case where a car might not be found

        const carPreviewsHTML = selectedCars.map(car => `
            <div class="compare-bar-item">
                <img src="${car.image}" alt="${car.name}">
                <span>${car.name}</span>
            </div>
        `).join('');

        const buttonDisabled = comparisonList.length < 2;

        compareBarContainer.innerHTML = `
            <div class="container d-flex justify-content-between align-items-center h-100">
                <div class="compare-bar-items">
                    ${carPreviewsHTML}
                    ${comparisonList.length < 4 ? `<div class="compare-bar-placeholder">Add up to ${4 - comparisonList.length} more</div>` : ''}
                </div>
                <div class="d-flex align-items-center">
                  <a href="compare.html" class="btn btn-primary ${buttonDisabled ? 'disabled' : ''}">
                      Compare (${comparisonList.length})
                  </a>
                  <button id="clear-bar-btn" class="btn btn-sm btn-outline-light ms-2"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;
        compareBarContainer.classList.add('visible');

        // Add event listener for the new clear button in the bar
        document.getElementById('clear-bar-btn').addEventListener('click', () => {
             saveComparisonList([]);
             renderCompareBar();
             applyFiltersAndSort(); // Re-render grid to uncheck boxes
        });
    };

    // =======================================================
    // 3. PAGE-SPECIFIC LOGIC & INITIALIZATION
    // =======================================================

    // --- General Setup (Runs on all pages) ---
    const checkAuth = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const nav = document.getElementById('main-nav');
        if (nav) {
            let newsLink = '<a href="news.html" class="nav-link text-white">News</a>';
            if (user) {
                let welcomeMessage = `<span>Welcome, ${user.username}</span> <a href="profile.html" class="text-white fw-bold ms-2">Profile</a>`;
                let adminButton = user.role === 'admin' ? `<a href="admin.html" class="btn btn-warning btn-sm">Admin Panel</a>` : '';
                nav.innerHTML = `${newsLink} ${welcomeMessage} ${adminButton} <button id="logout-btn" class="btn btn-danger btn-sm">Logout</button>`;
                document.getElementById('logout-btn').addEventListener('click', () => { 
                    fetch('api/logout.php', { method: 'POST' })
                    .then(() => {
                        localStorage.removeItem('currentUser'); 
                        window.location.href = 'index.html'; 
                    });
                });
            } else {
                nav.innerHTML = `${newsLink} <a href="login.html" class="btn btn-primary">Login</a> <a href="register.html" class="btn btn-secondary">Register</a>`;
            }
        }
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    };

    // --- Login Page Logic ---
    // --- Login Page Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Check if the 'success' property from our PHP script is true
                if (data.success) {
                    // CORRECTED LINES HERE
                    localStorage.setItem('currentUser', JSON.stringify({ 
                        username: data.username, 
                        role: data.role 
                    }));
                    // Use backticks (`) for the alert
                    alert(`Login successful! Welcome, ${data.username}.`);
                    window.location.href = 'index.html';
                } else {
                    // If success is not true, show the error message from PHP
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during login. Check the console for details.');
            });
        });
    }

    // --- Register Page Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password.length < 4) { alert('Password must be at least 4 characters long.'); return; }
            if (password !== confirmPassword) { alert('Passwords do not match.'); return; }

            // Create FormData for PHP POST request
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            // Use fetch to call your new API endpoint
            fetch('api/register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Show message from the server
                if (data.success) {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during registration.');
            });
        });
    }

    // --- Index Page Logic ---
    if (document.getElementById('main-car-grid')) {
        const allCars = getCars();
        const typeFilter = document.getElementById('filter-type');
        const sortBy = document.getElementById('sort-by');
        const resetBtn = document.getElementById('reset-filters-btn');
        const showFavoritesBtn = document.getElementById('show-favorites-btn');
        const carGrid = document.getElementById('main-car-grid');
        
        const renderModalContent = (carId) => {
            const car = allCars.find(c => c.id == carId);
            if (!car) return;

            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const modalCarContent = document.getElementById('modal-car-content');
            modalCarContent.innerHTML = `<img src="${car.image}" alt="${car.name}" class="img-fluid mb-3"><h3>${car.name} <small class="text-muted">(${car.year})</small></h3><p>${car.description}</p>`;
            
            const commentsList = document.getElementById('modal-comments-list');
            renderCommentsList(carId, commentsList);
            
            const commentFormContainer = document.getElementById('modal-comment-form-container');
            if (currentUser) {
                commentFormContainer.innerHTML = `<form id="add-comment-form"><div class="mb-3"><label for="comment-text" class="form-label">Add your comment:</label><textarea class="form-control" id="comment-text" rows="3" required></textarea></div><button type="submit" class="btn btn-primary">Post Comment</button></form>`;
                document.getElementById('add-comment-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    addComment(carId, document.getElementById('comment-text').value);
                });
            } else {
                commentFormContainer.innerHTML = `<p><a href="login.html">Log in</a> to post a comment.</p>`;
            }
        };

        const populateFilters = () => {
            const types = [...new Set(allCars.map(car => car.type))];
            typeFilter.innerHTML = '<option value="all" selected>All Types</option>';
            types.sort().forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeFilter.appendChild(option);
            });
        };

        applyFiltersAndSort = (showOnlyFavorites = false) => {
            let filteredCars = [...allCars];
            
            const currentFilterBtn = document.querySelector('.filter-btn.active');
            if(showOnlyFavorites || (currentFilterBtn && currentFilterBtn.id === 'show-favorites-btn')){
                 const favorites = getFavorites();
                 filteredCars = filteredCars.filter(car => favorites.includes(car.id));
            }

            const selectedType = typeFilter.value;
            if (selectedType !== 'all') {
                filteredCars = filteredCars.filter(car => car.type === selectedType);
            }
            const selectedSort = sortBy.value;
            switch (selectedSort) {
                case 'name-asc': filteredCars.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'year-desc': filteredCars.sort((a, b) => b.year - a.year); break;
                case 'year-asc': filteredCars.sort((a, b) => a.year - b.year); break;
            }
            renderCarGrid(filteredCars, carGrid);
        };
        
        typeFilter.addEventListener('change', () => { 
            showFavoritesBtn.classList.remove('active');
            applyFiltersAndSort(); 
        });
        sortBy.addEventListener('change', () => applyFiltersAndSort());
        resetBtn.addEventListener('click', () => { 
            typeFilter.value = 'all'; 
            sortBy.value = 'default'; 
            showFavoritesBtn.classList.remove('active');
            applyFiltersAndSort(); 
        });

        if (showFavoritesBtn) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(currentUser){
                showFavoritesBtn.style.display = 'block';
                showFavoritesBtn.addEventListener('click', (e) => {
                    e.currentTarget.classList.add('active');
                    applyFiltersAndSort(true);
                });
            } else {
                 showFavoritesBtn.style.display = 'none';
            }
        }
        
        document.getElementById('carDetailModal').addEventListener('click', (e) => {
            if (e.target.closest('.delete-comment-btn')) {
                const btn = e.target.closest('.delete-comment-btn');
                deleteComment(btn.dataset.carId, btn.dataset.commentDate);
            }
        });

        carGrid.addEventListener('click', (e) => {
            const favoriteIcon = e.target.closest('.favorite-icon');
            const cardBodyOrImage = e.target.closest('.card-img, .card-body');
            const compareCheckbox = e.target.closest('.compare-checkbox');

            if (compareCheckbox) {
                // This is a direct click on the checkbox or its label
                const carId = compareCheckbox.dataset.id;
                if (!toggleCompare(carId)) {
                    // If toggle failed (e.g. list was full), uncheck the box visually
                    compareCheckbox.checked = false;
                }
                renderCompareBar(); // Re-render the bar
                return; // Stop further processing to prevent modal opening
            }
            
            if (favoriteIcon) {
                // Click on the heart icon
                toggleFavorite(favoriteIcon.dataset.id);
            } else if (cardBodyOrImage) {
                // Click on the main card content to open the modal
                const card = cardBodyOrImage.closest('.car-card');
                if (card) {
                    renderModalContent(card.dataset.carId);
                }
            }
        });

        populateFilters();
        applyFiltersAndSort();
        renderCompareBar();
    }

    // --- Profile Page Logic ---
    if (document.querySelector('.profile-page-wrapper')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('You must be logged in to view this page.');
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('profile-username').textContent = currentUser.username;
        const allCars = getCars();
        const allComments = getComments();

        const favoriteIds = getFavorites();
        const favoriteCars = allCars.filter(car => favoriteIds.includes(car.id));
        const favoritesGrid = document.getElementById('favorites-grid');
        renderCarGrid(favoriteCars, favoritesGrid);

        const myCommentsList = document.getElementById('my-comments-list');
        const myComments = [];
        for (const carId in allComments) {
            const car = allCars.find(c => c.id == carId);
            if (car) {
                allComments[carId].forEach(comment => {
                    if (comment.username === currentUser.username) {
                        myComments.push({ carName: car.name, comment });
                    }
                });
            }
        }
        if (myComments.length > 0) {
            myCommentsList.innerHTML = myComments.sort((a,b) => new Date(b.comment.date) - new Date(a.comment.date)).map(item => `
                <div class="comment-item">
                    <p class="mb-1">On <strong>${item.carName}</strong> you wrote:</p>
                    <blockquote>"${item.comment.text}"</blockquote>
                    <small class="text-muted">${new Date(item.comment.date).toLocaleString()}</small>
                </div>
            `).join('');
        } else {
             myCommentsList.innerHTML = `<p>You haven't posted any comments yet.</p>`;
        }

        const changePasswordForm = document.getElementById('change-password-form');
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            // Client-side validation
            if (newPassword.length < 4) {
                alert('New password must be at least 4 characters long.');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                alert('New passwords do not match.');
                return;
            }

            // Create form data to send to the server
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);

            // Call the new API endpoint
            fetch('api/change_password.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show the message from the server (success or error)
                alert(data.message);
                
                // If successful, clear the form
                if (data.success) {
                    changePasswordForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while changing the password.');
            });
        });

        // Handle Danger Zone visibility and functionality
        const dangerZoneSection = document.getElementById('danger-zone-section');

        if (currentUser.role === 'admin') {
            // If user is admin, keep the danger zone hidden
            if (dangerZoneSection) {
                dangerZoneSection.setAttribute('hidden', '');
            }
        } else {
            // If user is not admin, show the danger zone and set up the delete functionality
            if (dangerZoneSection) {
                dangerZoneSection.removeAttribute('hidden');
                
                const deleteAccountBtn = document.getElementById('delete-account-btn');
                if (deleteAccountBtn) {
                    deleteAccountBtn.addEventListener('click', () => {
                        const isConfirmed = confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.');

                        if (isConfirmed) {
                            fetch('api/delete_account.php', { method: 'POST' })
                                .then(response => response.json())
                                .then(data => {
                                    alert(data.message);
                                    if (data.success) {
                                        localStorage.removeItem('currentUser');
                                        window.location.href = 'index.html';
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('An error occurred while deleting the account.');
                                });
                        }
                    });
                }
            }
        }
    }

    
    // --- Compare Page Logic ---
    if (document.getElementById('comparison-table-container')) {
        const renderComparisonTable = () => {
            const container = document.getElementById('comparison-table-container');
            const comparisonIds = getComparisonList();
            const allCars = getCars();

            if (comparisonIds.length < 2) {
                container.innerHTML = `
                    <div class="text-center p-5">
                        <h3>Please Select at Least 2 Models to Compare</h3>
                        <p class="text-muted">Go back to the showcase to select models you'd like to see side-by-side.</p>
                        <a href="index.html" class="btn btn-primary mt-3">Back to Showcase</a>
                    </div>
                `;
                document.getElementById('clear-comparison-btn').style.display = 'none';
                return;
            }

            document.getElementById('clear-comparison-btn').style.display = 'inline-block';
            const carsToCompare = allCars.filter(car => comparisonIds.includes(car.id));

            // Headers
            let tableHeadHTML = '<thead><tr><th>Feature</th>';
            carsToCompare.forEach(car => {
                tableHeadHTML += `<th><div class="compare-car-name">${car.name}</div></th>`;
            });
            tableHeadHTML += '</tr></thead>';

            // Body Rows
            let tableBodyHTML = '<tbody>';
            // Image Row
            tableBodyHTML += `<tr><td><strong>Image</strong></td>${carsToCompare.map(car => `<td><img src="${car.image}" alt="${car.name}" class="compare-car-image"></td>`).join('')}</tr>`;
            // Type Row
            tableBodyHTML += `<tr><td><strong>Type</strong></td>${carsToCompare.map(car => `<td>${car.type}</td>`).join('')}</tr>`;
            // Year Row
            tableBodyHTML += `<tr><td><strong>Year</strong></td>${carsToCompare.map(car => `<td>${car.year}</td>`).join('')}</tr>`;
            // Description Row
            tableBodyHTML += `<tr><td><strong>Description</strong></td>${carsToCompare.map(car => `<td>${car.description}</td>`).join('')}</tr>`;
            
            tableBodyHTML += '</tbody>';
            
            container.innerHTML = `<table class="table table-bordered table-hover comparison-table">${tableHeadHTML}${tableBodyHTML}</table>`;
        };

        const clearBtn = document.getElementById('clear-comparison-btn');
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your comparison selection?')) {
                saveComparisonList([]);
                renderComparisonTable();
                // Optionally redirect
                // window.location.href = 'index.html'; 
            }
        });

        renderComparisonTable();
    }

    // --- News Listing Page Logic ---
    if (document.querySelector('.news-page-wrapper')) {
        const articles = getNews().sort((a,b) => new Date(b.date) - new Date(a.date)); // Show newest first
        const newsGrid = document.getElementById('news-grid');
        if (articles.length > 0) {
            newsGrid.innerHTML = articles.map(article => `
                <div class="news-card">
                    <img src="${article.image}" alt="${article.title}" class="news-card-img">
                    <div class="news-card-body">
                        <div class="news-card-meta">
                            <span>${new Date(article.date).toLocaleDateString()}</span> | <span>By ${article.author}</span>
                        </div>
                        <h3 class="news-card-title">${article.title}</h3>
                        <p class="news-card-content">${article.content.substring(0, 150)}...</p>
                        <a href="article.html?id=${article.id}" class="btn btn-outline-primary">Read More</a>
                    </div>
                </div>
            `).join('');
        } else {
            newsGrid.innerHTML = '<p>No news articles have been posted yet.</p>';
        }
    }

    // --- Single Article Page Logic ---
    if (document.querySelector('.article-page-wrapper')) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id'));
        const article = getNews().find(a => a.id === articleId);
        const articleContainer = document.getElementById('article-content');

        if (article) {
            document.title = `${article.title} - BYD Showcase`; // Set page title
            articleContainer.innerHTML = `
                <h1>${article.title}</h1>
                <div class="article-meta mb-4">
                    <span>By <strong>${article.author}</strong></span> | 
                    <span>Published on ${new Date(article.date).toLocaleDateString()}</span>
                </div>
                <img src="${article.image}" alt="${article.title}" class="img-fluid rounded mb-4 article-image">
                <div class="article-body">
                    ${article.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
            `;
        } else {
            articleContainer.innerHTML = '<h1>Article not found</h1><p>The requested article could not be found. It may have been removed.</p><a href="news.html" class="btn btn-primary">Back to News</a>';
        }
    }

    // --- Admin Page Logic ---
    if (document.querySelector('.admin-wrapper')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') { alert('Access Denied.'); window.location.href = 'index.html'; return; }
        const carForm = document.getElementById('car-form');
        const adminTableBody = document.getElementById('admin-car-table-body');
        const formTitle = document.getElementById('form-title');
        const carIdInput = document.getElementById('car-id');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const renderAdminTable = () => {
            adminTableBody.innerHTML = getCars().map(car => `<tr><td><img src="${car.image}" alt="${car.name}"></td><td>${car.name}</td><td>${car.year}</td><td><button class="btn btn-sm btn-info edit-btn" data-id="${car.id}">Edit</button><button class="btn btn-sm btn-danger delete-btn" data-id="${car.id}">Delete</button></td></tr>`).join('');
        };
        const resetCarForm = () => { carForm.reset(); carIdInput.value = ''; formTitle.textContent = 'Add New Car Model'; cancelEditBtn.style.display = 'none'; };
        const showCarFormForEdit = (id) => {
            const carToEdit = getCars().find(car => car.id == id);
            if (carToEdit) {
                formTitle.textContent = `Edit: ${carToEdit.name}`;
                carIdInput.value = carToEdit.id;
                document.getElementById('car-name').value = carToEdit.name;
                document.getElementById('car-type').value = carToEdit.type;
                document.getElementById('car-year').value = carToEdit.year;
                document.getElementById('car-image').value = carToEdit.image;
                document.getElementById('car-description').value = carToEdit.description;
                cancelEditBtn.style.display = 'inline-block';
                window.scrollTo(0, 0);
            }
        };
        carForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = carIdInput.value;
            let cars = getCars();
            const carData = {
                name: document.getElementById('car-name').value,
                type: document.getElementById('car-type').value,
                year: parseInt(document.getElementById('car-year').value),
                image: document.getElementById('car-image').value,
                description: document.getElementById('car-description').value
            };
            if (id) {
                cars = cars.map(car => car.id == id ? { ...car, ...carData } : car);
                alert('Model updated successfully!');
            } else {
                carData.id = Date.now();
                cars.push(carData);
                alert('New model added successfully!');
            }
            saveCars(cars);
            renderAdminTable();
            resetCarForm();
        });
        adminTableBody.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.dataset.id;
            if (target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this model?')) {
                    saveCars(getCars().filter(car => car.id != id));
                    renderAdminTable();
                }
            } else if (target.classList.contains('edit-btn')) {
                showCarFormForEdit(id);
            }
        });
        cancelEditBtn.addEventListener('click', resetCarForm);
        renderAdminTable();

        // --- News Management in Admin Panel ---
        const newsForm = document.getElementById('news-form');
        const newsTableBody = document.getElementById('admin-news-table-body');
        const newsFormTitle = document.getElementById('news-form-title');
        const newsIdInput = document.getElementById('news-id');
        const cancelNewsEditBtn = document.getElementById('cancel-news-edit-btn');
        
        const renderAdminNewsTable = () => {
            newsTableBody.innerHTML = getNews().map(article => `
                <tr>
                    <td>${article.title}</td>
                    <td>${new Date(article.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-news-btn" data-id="${article.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-news-btn" data-id="${article.id}">Delete</button>
                    </td>
                </tr>
            `).join('');
        };
        
        const resetNewsForm = () => {
            newsForm.reset();
            newsIdInput.value = '';
            newsFormTitle.textContent = 'Add New Article';
            cancelNewsEditBtn.style.display = 'none';
        };

        const showNewsFormForEdit = (id) => {
            const articleToEdit = getNews().find(article => article.id == id);
            if (articleToEdit) {
                newsFormTitle.textContent = `Edit: ${articleToEdit.title}`;
                newsIdInput.value = articleToEdit.id;
                document.getElementById('news-title').value = articleToEdit.title;
                document.getElementById('news-image').value = articleToEdit.image;
                document.getElementById('news-author').value = articleToEdit.author;
                document.getElementById('news-content').value = articleToEdit.content;
                cancelNewsEditBtn.style.display = 'inline-block';
                window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom where the form is
            }
        };

        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = newsIdInput.value;
            let news = getNews();
            const newsData = {
                title: document.getElementById('news-title').value,
                image: document.getElementById('news-image').value,
                author: document.getElementById('news-author').value,
                content: document.getElementById('news-content').value
            };

            if (id) { // Editing existing
                news = news.map(article => article.id == id ? { ...article, ...newsData } : article);
                alert('Article updated successfully!');
            } else { // Adding new
                newsData.id = Date.now();
                newsData.date = new Date().toISOString();
                news.push(newsData);
                alert('New article added successfully!');
            }
            saveNews(news);
            renderAdminNewsTable();
            resetNewsForm();
        });

        newsTableBody.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.dataset.id;
            if (target.classList.contains('delete-news-btn')) {
                if (confirm('Are you sure you want to delete this article?')) {
                    saveNews(getNews().filter(article => article.id != id));
                    renderAdminNewsTable();
                }
            } else if (target.classList.contains('edit-news-btn')) {
                showNewsFormForEdit(id);
            }
        });
        cancelNewsEditBtn.addEventListener('click', resetNewsForm);
        renderAdminNewsTable();

        // =======================================================
    //  ADD THIS NEW CODE BLOCK FOR THE ADMIN LOGOUT BUTTON
    // =======================================================
    const adminLogoutBtn = document.getElementById('logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            fetch('api/logout.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Should say "Logout successful."
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Logout failed:', error);
                // Even if the server call fails, log the user out on the client side
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        });
    }
    }
    
    // --- INITIALIZE (Runs on all pages) ---
    checkAuth();
});