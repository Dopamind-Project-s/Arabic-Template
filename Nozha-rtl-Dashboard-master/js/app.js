(function () {
  const fallbackDictionaries = {
    ar: {
      theme_dark: '🌙 داكن',
      theme_light: '☀️ فاتح',
      notify_saved: 'تم حفظ الإعدادات بنجاح',
      notify_warning_msg: 'يوجد عناصر تحتاج متابعة عاجلة.',
      notify_title: 'النظام',
      info_title: 'تفاصيل التنبيه',
      info_text: 'القالب مبني بأسلوب Bootstrap-first ويعمل بسلاسة مع RTL/LTR.',
      calendar_fallback: 'تعذر تحميل التقويم. تحقق من الاتصال بالشبكة.',
      date_fallback: 'تعذر تحميل أداة التاريخ والوقت.'
    },
    en: {
      theme_dark: '🌙 Dark',
      theme_light: '☀️ Light',
      notify_saved: 'Settings were saved successfully',
      notify_warning_msg: 'There are items that require immediate follow-up.',
      notify_title: 'System',
      info_title: 'Alert Details',
      info_text: 'This template follows a Bootstrap-first approach with smooth RTL/LTR support.',
      calendar_fallback: 'Calendar failed to load. Please check your network connection.',
      date_fallback: 'Date/time picker failed to load.'
    }
  };

  const bootstrapHref = {
    rtl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css',
    ltr: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
  };

  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const state = {
    locale: localStorage.getItem('app_locale') || 'ar',
    theme: localStorage.getItem('app_theme') || preferredTheme,
    dictionary: fallbackDictionaries.ar
  };

  const el = {
    bootstrapCss: document.getElementById('bootstrapCss'),
    localeToggle: document.getElementById('localeToggle'),
    mobileLocaleToggle: document.getElementById('mobileLocaleToggle'),
    themeToggle: document.getElementById('themeToggle'),
    mobileThemeToggle: document.getElementById('mobileThemeToggle'),
    successToast: document.getElementById('successToast'),
    warningToast: document.getElementById('warningToast'),
    infoAlert: document.getElementById('infoAlert'),
    currentTime: document.getElementById('currentTime'),
    calendarFallback: document.getElementById('calendarFallback'),
    dateFallback: document.getElementById('dateFallback'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    appSidebar: document.getElementById('appSidebar')
  };

  let calendar;

  const setDirection = (locale) => {
    const isArabic = locale === 'ar';
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    if (el.bootstrapCss) el.bootstrapCss.setAttribute('href', isArabic ? bootstrapHref.rtl : bootstrapHref.ltr);
  };

  const syncThemeButtons = (theme) => {
    const label = theme === 'dark' ? (state.dictionary.theme_light || '☀️ Light') : (state.dictionary.theme_dark || '🌙 Dark');
    if (el.themeToggle) el.themeToggle.textContent = label;
    if (el.mobileThemeToggle) el.mobileThemeToggle.textContent = label;
  };

  const syncLocaleButtons = (locale) => {
    const label = locale === 'ar' ? '🌐 English (LTR)' : '🌐 العربية (RTL)';
    if (el.localeToggle) el.localeToggle.textContent = label;
    if (el.mobileLocaleToggle) el.mobileLocaleToggle.textContent = label;
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
    syncThemeButtons(theme);
  };

  const applyTranslations = (dict) => {
    state.dictionary = dict;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (dict[key]) node.textContent = dict[key];
    });
    if (el.calendarFallback) el.calendarFallback.textContent = dict.calendar_fallback || el.calendarFallback.textContent;
    if (el.dateFallback) el.dateFallback.textContent = dict.date_fallback || el.dateFallback.textContent;
    syncThemeButtons(state.theme);
  };

  const loadLocale = async (locale) => {
    let dict = fallbackDictionaries[locale] || fallbackDictionaries.ar;
    try {
      const response = await fetch(`./locales/${locale}/common.json`, { cache: 'no-store' });
      if (response.ok) dict = await response.json();
    } catch (error) {
      console.warn('Locale fetch fallback:', error);
    }

    applyTranslations(dict);
    setDirection(locale);
    syncLocaleButtons(locale);

    if (calendar) {
      calendar.setOption('locale', locale === 'ar' ? 'ar' : 'en');
      calendar.setOption('direction', locale === 'ar' ? 'rtl' : 'ltr');
      calendar.render();
    }

    localStorage.setItem('app_locale', locale);
  };

  const initCalendar = () => {
    const calendarEl = document.getElementById('calendar');
    if (!window.FullCalendar || !calendarEl) return;
    try {
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: state.locale,
        direction: state.locale === 'ar' ? 'rtl' : 'ltr',
        headerToolbar: { start: 'prev,next today', center: 'title', end: 'dayGridMonth,timeGridWeek' },
        events: [
          { title: 'Sprint Planning', start: new Date().toISOString().slice(0, 10) },
          { title: 'Client Review', start: new Date(Date.now() + 86400000).toISOString().slice(0, 10) }
        ]
      });
      calendar.render();
    } catch (error) {
      if (el.calendarFallback) el.calendarFallback.classList.remove('d-none');
    }
  };

  const initDatePicker = () => {
    if (!window.flatpickr || !document.getElementById('meetingDate')) return;
    try { flatpickr('#meetingDate', { enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true }); }
    catch (error) { if (el.dateFallback) el.dateFallback.classList.remove('d-none'); }
  };

  const initClock = () => {
    if (!el.currentTime) return;
    const tick = () => { el.currentTime.textContent = new Date().toLocaleString(document.documentElement.lang || 'ar'); };
    tick();
    setInterval(tick, 1000);
  };

  const toggleTheme = () => {
    state.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(state.theme);
  };

  const toggleLocale = () => {
    state.locale = state.locale === 'ar' ? 'en' : 'ar';
    loadLocale(state.locale);
  };

  const toggleSidebar = () => {
    if (!el.appSidebar) return;
    if (window.innerWidth <= 991) el.appSidebar.classList.toggle('open');
    else document.body.classList.toggle('sidebar-collapsed');
  };

  const bindEvents = () => {
    if (el.localeToggle) el.localeToggle.addEventListener('click', toggleLocale);
    if (el.mobileLocaleToggle) el.mobileLocaleToggle.addEventListener('click', toggleLocale);
    if (el.themeToggle) el.themeToggle.addEventListener('click', toggleTheme);
    if (el.mobileThemeToggle) el.mobileThemeToggle.addEventListener('click', toggleTheme);
    if (el.sidebarToggle) el.sidebarToggle.addEventListener('click', toggleSidebar);

    if (el.successToast) el.successToast.addEventListener('click', () => toastr.success(state.dictionary.notify_saved, state.dictionary.notify_title));
    if (el.warningToast) el.warningToast.addEventListener('click', () => toastr.warning(state.dictionary.notify_warning_msg, state.dictionary.notify_title));
    if (el.infoAlert) el.infoAlert.addEventListener('click', () => Swal.fire({ icon: 'info', title: state.dictionary.info_title, text: state.dictionary.info_text }));
  };

  const init = async () => {
    setTheme(state.theme);
    initCalendar();
    initDatePicker();
    initClock();
    bindEvents();
    await loadLocale(state.locale);
  };

  init();
})();
