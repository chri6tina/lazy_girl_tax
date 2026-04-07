// Mobile menu toggle + lead / visit notifications (Telegram via /api/notify/*)

(function () {
    function postJson(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
        });
    }

    function notifyVisitOnce() {
        try {
            if (sessionStorage.getItem('lgt_visit_ping')) return;
        } catch {
            /* private mode */
        }

        var pathOnly = window.location.pathname || '/';
        if (/^\/admin(\/|$)/i.test(pathOnly)) {
            return;
        }

        try {
            sessionStorage.setItem('lgt_visit_ping', '1');
        } catch {
            /* private mode */
        }

        var path = pathOnly + (window.location.search || '');
        var ref = '';
        try {
            ref = document.referrer || '';
        } catch (_) {
            ref = '';
        }

        postJson('/api/notify/visit', {
            path: path.slice(0, 320),
            referrer: ref.slice(0, 200)
        }).catch(function () {});
    }

    function formToPayload(form) {
        var source = form.getAttribute('data-lead-source');
        if (!source) return null;

        var fd = new FormData(form);
        var o = { source: source };
        fd.forEach(function (v, k) {
            if (typeof v === 'string') o[k] = v;
        });
        return o;
    }

    function bindLeadForms() {
        document.querySelectorAll('form[data-lead-source]').forEach(function (form) {
            if (form.dataset.leadBound) return;
            form.dataset.leadBound = 'true';
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var payload = formToPayload(form);
                if (!payload) return;

                var btn = form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );
                if (btn) btn.disabled = true;

                postJson('/api/notify/lead', payload)
                    .then(function (r) {
                        return r.json().then(function (j) {
                            return { ok: r.ok, j: j };
                        });
                    })
                    .then(function (_ref) {
                        var ok = _ref.ok;
                        if (!ok) throw new Error((_ref.j && _ref.j.error) || 'Request failed');
                        if (form.id === 'resourcesForm') {
                            alert(
                                'Thank you for signing up! Check your email for your free resource guide.'
                            );
                        } else if (form.id === 'testimonialForm') {
                            alert(
                                'Thank you for your submission! We appreciate your feedback.'
                            );
                        } else {
                            alert(
                                'Thank you for contacting us! We will get back to you soon via your preferred communication method.'
                            );
                        }
                        form.reset();
                    })
                    .catch(function () {
                        alert(
                            'Something went wrong sending your message. Please try again or email us directly.'
                        );
                    })
                    .finally(function () {
                        if (btn) btn.disabled = false;
                    });
            });
        });
    }

    var initSiteScripts = function () {
        var mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        var navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle && navMenu && !mobileMenuToggle.dataset.menuBound) {
            mobileMenuToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
            });
            mobileMenuToggle.dataset.menuBound = 'true';
        }

        if (!document.body.dataset.menuDocBound) {
            document.addEventListener('click', function (event) {
                var currentMenu = document.querySelector('.nav-menu');
                var currentToggle = document.querySelector('.mobile-menu-toggle');

                if (!currentMenu || !currentToggle) {
                    return;
                }

                if (
                    !currentMenu.contains(event.target) &&
                    !currentToggle.contains(event.target)
                ) {
                    currentMenu.classList.remove('active');
                }
            });
            document.body.dataset.menuDocBound = 'true';
        }

        bindLeadForms();
        notifyVisitOnce();

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            if (anchor.dataset.smoothBound) return;
            anchor.dataset.smoothBound = 'true';
            anchor.addEventListener('click', function (e) {
                var href = anchor.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    var target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };

    window.initSiteScripts = initSiteScripts;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteScripts);
    } else {
        initSiteScripts();
    }
})();
