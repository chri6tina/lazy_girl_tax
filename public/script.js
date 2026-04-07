// Mobile menu toggle + lead / visit notifications (Telegram via /api/notify/*)

(function () {
    function postJson(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
        });
    }

    function burstConfetti(canvas) {
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        function sizeCanvas() {
            var dpr = window.devicePixelRatio || 1;
            var w = window.innerWidth;
            var h = window.innerHeight;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        sizeCanvas();
        var onResize = function () {
            sizeCanvas();
        };
        window.addEventListener('resize', onResize);

        var colors = ['#00AFF0', '#3CB371', '#FFC107', '#FF6B9D', '#1F1F1F', '#FFF6EB', '#E67E3C'];
        var particles = [];
        var secondBurst = false;

        function spawn(cx, cy, n, spread) {
            spread = spread || 1;
            for (var i = 0; i < n; i += 1) {
                var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4 * spread;
                var speed = (10 + Math.random() * 14) * spread;
                particles.push({
                    x: cx + (Math.random() - 0.5) * 50,
                    y: cy,
                    vx: Math.cos(a) * speed,
                    vy: Math.sin(a) * speed,
                    rot: Math.random() * Math.PI * 2,
                    vr: (Math.random() - 0.5) * 0.35,
                    w: 5 + Math.random() * 7,
                    h: 7 + Math.random() * 11,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    g: 0.22 + Math.random() * 0.18,
                    drag: 0.988 + Math.random() * 0.008,
                    life: 1
                });
            }
        }

        var w = window.innerWidth;
        var h = window.innerHeight;
        spawn(w * 0.5, h * 0.4, 95, 1);

        var start = performance.now();
        var duration = 3200;

        function frame(now) {
            var elapsed = now - start;
            if (!secondBurst && elapsed > 200) {
                secondBurst = true;
                spawn(w * 0.5, h * 0.45, 55, 0.85);
            }

            w = window.innerWidth;
            h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            for (var p = 0; p < particles.length; p += 1) {
                var o = particles[p];
                o.vy += o.g;
                o.vx *= o.drag;
                o.vy *= o.drag;
                o.x += o.vx;
                o.y += o.vy;
                o.rot += o.vr;
                if (elapsed > duration - 400) {
                    o.life = Math.max(0, o.life - 0.02);
                }
                ctx.save();
                ctx.globalAlpha = o.life;
                ctx.translate(o.x, o.y);
                ctx.rotate(o.rot);
                ctx.fillStyle = o.color;
                ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h);
                ctx.restore();
            }

            if (elapsed < duration) {
                requestAnimationFrame(frame);
            } else {
                window.removeEventListener('resize', onResize);
            }
        }

        requestAnimationFrame(frame);
    }

    function prefersReducedMotion() {
        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    }

    function showLeadSuccessModal(opts) {
        var title = opts.title || "You're all set!";
        var message = opts.message || "We'll be in touch soon.";
        var buttonText = opts.buttonText || 'Got it';

        var root = document.createElement('div');
        root.className = 'lgt-celebration-root';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-labelledby', 'lgt-celebration-title');

        var backdrop = document.createElement('div');
        backdrop.className = 'lgt-celebration-backdrop';

        var dialog = document.createElement('div');
        dialog.className = 'lgt-celebration-dialog';

        var badge = document.createElement('div');
        badge.className = 'lgt-celebration-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = '<span class="lgt-celebration-spark">&#10022;</span>';

        var h2 = document.createElement('h2');
        h2.id = 'lgt-celebration-title';
        h2.className = 'lgt-celebration-title';
        h2.textContent = title;

        var p = document.createElement('p');
        p.className = 'lgt-celebration-message';
        p.textContent = message;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lgt-celebration-close btn btn-primary';
        btn.textContent = buttonText;

        dialog.appendChild(badge);
        dialog.appendChild(h2);
        dialog.appendChild(p);
        dialog.appendChild(btn);

        root.appendChild(backdrop);
        root.appendChild(dialog);
        document.body.appendChild(root);

        var prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        if (!prefersReducedMotion()) {
            var canvas = document.createElement('canvas');
            canvas.className = 'lgt-celebration-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            root.insertBefore(canvas, dialog);
            burstConfetti(canvas);
        }

        function close() {
            document.body.style.overflow = prevOverflow;
            root.remove();
            document.removeEventListener('keydown', onKey);
        }

        function onKey(e) {
            if (e.key === 'Escape') close();
        }

        document.addEventListener('keydown', onKey);
        backdrop.addEventListener('click', close);
        btn.addEventListener('click', close);

        setTimeout(function () {
            btn.focus();
        }, 80);
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

                fetch('/api/notify/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(payload)
                })
                    .then(function (r) {
                        return r.text().then(function (text) {
                            var j = {};
                            if (text) {
                                try {
                                    j = JSON.parse(text);
                                } catch (e) {
                                    j = { error: text.slice(0, 200) || 'Bad response' };
                                }
                            }
                            return { ok: r.ok, status: r.status, j: j };
                        });
                    })
                    .then(function (_ref) {
                        if (!_ref.ok) {
                            var errMsg = (_ref.j && _ref.j.error) || 'Request failed';
                            throw new Error(errMsg + ' (' + _ref.status + ')');
                        }
                        if (form.id === 'resourcesForm') {
                            showLeadSuccessModal({
                                title: "You're on the list!",
                                message:
                                    'Thanks for signing up. Check your email for your free resource guide—we’ll keep you posted.',
                                buttonText: 'Awesome'
                            });
                        } else if (form.id === 'testimonialForm') {
                            showLeadSuccessModal({
                                title: 'Thank you!',
                                message:
                                    'We received your message and really appreciate you taking the time. We’ll follow up when we can.',
                                buttonText: 'Great'
                            });
                        } else {
                            showLeadSuccessModal({
                                title: 'We got it!',
                                message:
                                    'Thanks for reaching out. We’ll be in contact soon using your preferred method.',
                                buttonText: 'Sounds good'
                            });
                        }
                        form.reset();
                    })
                    .catch(function (err) {
                        var msg = (err && err.message) || '';
                        console.error('notify/lead:', msg || err);
                        if (/Name and valid email|State is required|Message is required|Invalid source|Too many requests/i.test(msg)) {
                            alert(msg.replace(/\s*\(\d+\)\s*$/, '').trim());
                        } else {
                            alert(
                                'Something went wrong sending your message. Please try again or email us directly.'
                            );
                        }
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
