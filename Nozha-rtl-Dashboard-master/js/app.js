(function () {
  const fallbackDictionaries = {
    ar: {
      app_title: 'لوحة المشاريع',
      welcome: 'مرحبًا بك في قالب المشاريع',
      subtitle: 'قالب عربي افتراضي يدعم RTL/LTR، الوضع الليلي، والترجمة.',
      notify_saved: 'تم حفظ الإعدادات بنجاح',
      notify_warning_msg: 'يوجد مهام متأخرة تحتاج متابعة.',
      notify_title: 'التطبيق',
      info_title: 'إعدادات القالب',
      info_text: 'القالب مبني على Bootstrap ويدعم RTL/LTR و Dark/Light.',
      theme_dark: '🌙 داكن',
      theme_light: '☀️ فاتح',
      calendar_fallback: 'تعذر تحميل التقويم، تحقق من الشبكة.',
      date_fallback: 'تعذر تحميل أداة التاريخ/الوقت.'
    },
    en: {
      app_title: 'Projects Dashboard',
      welcome: 'Welcome to Projects Template',
      subtitle: 'Arabic-first template with RTL/LTR, dark mode, and i18n.',
      notify_saved: 'Settings saved successfully',
      notify_warning_msg: 'There are overdue tasks that need follow-up.',
      notify_title: 'App',
      info_title: 'Template Settings',
      info_text: 'Template is Bootstrap-first with RTL/LTR and Dark/Light support.',
      theme_dark: '🌙 Dark',
      theme_light: '☀️ Light',
      calendar_fallback: 'Calendar failed to load. Please check network access.',
      date_fallback: 'Date/Time picker failed to load.'
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
    localeSelect: document.getElementById('localeSelect'),
    mobileLocale: document.getElementById('mobileLocale'),
    themeToggle: document.getElementById('themeToggle'),
    mobileThemeToggle: document.getElementById('mobileThemeToggle'),
    successToast: document.getElementById('successToast'),
    warningToast: document.getElementById('warningToast'),
    infoAlert: document.getElementById('infoAlert'),
    currentTime: document.getElementById('currentTime'),
    calendarFallback: document.getElementById('calendarFallback'),
    dateFallback: document.getElementById('dateFallback')
  };

  let calendar;

  const setDirection = (locale) => {
    const isArabic = locale === 'ar';
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    el.bootstrapCss.setAttribute('href', isArabic ? bootstrapHref.rtl : bootstrapHref.ltr);
  };

  const syncThemeButtons = (theme) => {
    const darkLabel = state.dictionary.theme_dark || '🌙 Dark';
    const lightLabel = state.dictionary.theme_light || '☀️ Light';
    const label = theme === 'dark' ? lightLabel : darkLabel;
    el.themeToggle.textContent = label;
    el.mobileThemeToggle.textContent = label;
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
    syncThemeButtons(state.theme);
    if (el.calendarFallback) el.calendarFallback.textContent = dict.calendar_fallback || el.calendarFallback.textContent;
    if (el.dateFallback) el.dateFallback.textContent = dict.date_fallback || el.dateFallback.textContent;
  };

  const loadLocale = async (locale) => {
    let dict = fallbackDictionaries[locale] || fallbackDictionaries.ar;

    try {
      const response = await fetch(`./locales/${locale}/common.json`, { cache: 'no-store' });
      if (response.ok) {
        dict = await response.json();
      }
    } catch (error) {
      console.warn('Locale fetch fallback:', error);
    }

    applyTranslations(dict);
    setDirection(locale);

    if (calendar) {
      calendar.setOption('locale', locale === 'ar' ? 'ar' : 'en');
      calendar.setOption('direction', locale === 'ar' ? 'rtl' : 'ltr');
      calendar.render();
    }

    localStorage.setItem('app_locale', locale);
    el.localeSelect.value = locale;
    el.mobileLocale.value = locale;
  };

  const initCalendar = () => {
    if (!window.FullCalendar || !document.getElementById('calendar')) {
      el.calendarFallback.classList.remove('d-none');
      return;
    }

    try {
      const calendarEl = document.getElementById('calendar');
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: state.locale,
        direction: state.locale === 'ar' ? 'rtl' : 'ltr',
        headerToolbar: {
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
          { title: 'Sprint Planning', start: new Date().toISOString().slice(0, 10) },
          { title: 'Client Meeting', start: new Date(Date.now() + 86400000).toISOString().slice(0, 10) }
        ]
      });

      calendar.render();
      el.calendarFallback.classList.add('d-none');
    } catch (error) {
      console.warn('Calendar init failed:', error);
      el.calendarFallback.classList.remove('d-none');
    }
  };

  const initDatePicker = () => {
    if (!window.flatpickr) {
      el.dateFallback.classList.remove('d-none');
      return;
    }

    try {
      flatpickr('#meetingDate', {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true
      });
      el.dateFallback.classList.add('d-none');
    } catch (error) {
      console.warn('Date picker init failed:', error);
      el.dateFallback.classList.remove('d-none');
    }
  };

  const initNowClock = () => {
    const updateClock = () => {
      el.currentTime.textContent = new Date().toLocaleString(document.documentElement.lang || 'ar');
    };

    updateClock();
    setInterval(updateClock, 1000);
  };

  const toggleTheme = () => {
    state.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(state.theme);
  };

  const bindEvents = () => {
    el.localeSelect.addEventListener('change', (e) => {
      state.locale = e.target.value;
      loadLocale(state.locale);
    });

    el.mobileLocale.addEventListener('change', (e) => {
      state.locale = e.target.value;
      loadLocale(state.locale);
    });

    el.themeToggle.addEventListener('click', toggleTheme);
    el.mobileThemeToggle.addEventListener('click', toggleTheme);

    el.successToast.addEventListener('click', () => {
      toastr.success(state.dictionary.notify_saved || 'Saved', state.dictionary.notify_title || 'App');
    });

    el.warningToast.addEventListener('click', () => {
      toastr.warning(state.dictionary.notify_warning_msg || 'Warning', state.dictionary.notify_title || 'App');
    });

    el.infoAlert.addEventListener('click', () => {
      Swal.fire({
        icon: 'info',
        title: state.dictionary.info_title || 'Info',
        text: state.dictionary.info_text || ''
      });
    });
  };

  const init = async () => {
    el.localeSelect.value = state.locale;
    el.mobileLocale.value = state.locale;
    setTheme(state.theme);
    initCalendar();
    initDatePicker();
    initNowClock();
    bindEvents();
    await loadLocale(state.locale);
  };

  init();
})();
