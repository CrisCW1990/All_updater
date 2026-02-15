export type Language = 'en' | 'es';

export const translations = {
    en: {
        // Layout & Navigation
        dashboard: "Dashboard",
        history: "History",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        language: "Language",
        spanish: "Spanish",
        english: "English",

        // Dashboard Header
        manageApps: "Manage your applications",
        checking: "Checking for Updates",
        refresh: "Refresh updates",
        updateSelected: "Update Selected",
        readyTitle: "Ready when you are!",
        readyDesc: "Hit the button to scour the depths of your PC for outdated software.",
        checkUpdates: "Check for Updates",
        footerLove: "Crafted with love by",
        footerAI: "AI included (mostly to judge your outdated software).",

        // Dashboard States
        allClean: "All systems go!",
        allCleanDesc: "No crumby old apps found here. You're squeaky clean.",
        checkAgain: "Check again just in case?",
        selectAll: "Select All",
        updatesAvailable: "updates available",

        // Winget Missing
        wingetMissing: "Winget is missing!",
        wingetMissingDesc: "I'm powerful, but I'm not a sorcerer. You need to install the App Installer from the Microsoft Store first.",
        getWinget: "Get Winget (Redirects to Microsoft Store)",

        // UpdateCard
        current: "Current",
        new: "New",
        unknown: "Unknown",

        // Toast Notifications
        updateSuccess: "Successfully updated",
        updateFailed: "Failed to update",
        updateSkipped: "skipped: No applicable update found",
        updateInapplicable: "Not needed right now",
        updateInapplicableDesc: "The installer indicated this version is not applicable to your device.",
        updateManualUninstall: "Manual uninstall required (different technology)",

        // Restore Modal
        safetyFirst: "Safety First",
        restoreAsk: "Create a restore point before updating?",
        restoreDesc: "Updating applications can sometimes cause system instability. We strongly recommend creating a System Restore point so you can undo changes if needed.",
        restoreNote: "Note: Creating a restore point takes a few minutes and requires Administrator privileges.",
        restoreFailedAbort: "System Restore failed. Aborting to protect your PC.",
        skipUpdate: "Skip & Update",
        skipRisk: "Faster, but riskier",
        createUpdate: "Create & Update",
        conflictTitle: "Application (or Process) Running",
        conflictBody: "{app} files are in use. If the app is not open, it might be a background service or a hidden process.",
        conflictTip: "Tip: Check the system tray (bottom right). If not there, check Task Manager for related processes.",
        retry: "I closed it, Retry",
        skip: "Skip Update",
        statusSecurity: "Security Risk (Skipped)",
        recommended: "Recommended",

        // Overlays
        creatingRestore: "Creating System Restore Point",
        restoreWait: "This usually takes about 30-60 seconds. Taking a safety snapshot before we start.",
        installingUpdates: "Installing Updates",
        updatingApp: "Updating",

        // Summary Modal
        summaryTitle: "Post-Update Report",
        summaryDesc: "The results are in, and they're spectacular.",
        summarySuccess: "Everything went better than expected. I'm actually impressed.",
        summaryPartial: "Some things worked, some didn't. Balanced, as all things should be.",
        summaryFailed: "Well, that was a disaster. Let's pretend it never happened.",
        thanksNothing: "Great, thanks for nothing",
        closeSuccess: "Awesome, thanks!",
        statusSuccess: "Updated with zero complaints. My talent is wasted here.",
        statusInapplicable: "Inapplicable: This app decided its current version is its 'peak performance'.",
        statusFailed: "Everything is fine, except this. This is not fine.",
        statusReboot: "Installed, but needs a reboot. Don't complain if it doesn't work yet.",
        statusInUse: "Blocked! Close the app if you actually want me to update it.",
        restartRecommendation: "Recommendation: Unless you plan to update more things now, a system restart is highly advised.",

        // History Status Phrases
        historySuccess: "Worked perfectly (against all odds)",
        historyInapplicable: "Inapplicable: The installer decided it's too cool for your PC today",
        historySkipped: "Skipped because why bother doing it twice?",
        historyBroken: "It just broke. Don't look at me.",
        historyEmpty: "History is empty. Like my soul.",
        historyEmptySmall: "Start installing something to fill this void.",
        historyReboot: "Installed, but is demanding a sacrifice (a system reboot).",
        historyInUse: "Failed because you couldn't be bothered to close it.",
        historyRecord: "A record of all the times you've asked me to do things.",

        // History Actions
        // History Actions
        resetApp: "Reset App",
        resetAppConfirm: "Reset Application?",
        resetAppMessage: "This will wipe history and reset your settings (language, welcome screen). No going back.",
        confirm: "Confirm",
        cancel: "Cancel",

        // New UI Elements
        scanningBody: "Scouring the depths of your PC...",
        dataTransparencyTitle: "Data Transparency",
        dataTransparency: "We are clear and non-invasive. Your options and history are stored locally at:",

        // Onboarding
        onboardingTitle: "Welcome to All Updater",
        onboardingBody: "I help you update your INSTALLED applications (Browsers, Discord, Steam, etc.). I am NOT Windows Update and I do not touch your operating system. Everything happens locally.",
        onboardingBtn: "Get Started",
        onboardingDontShow: "Do not show again",
        onboardingLangTitle: "Select Language",
        onboardingLangNote: "You can change this later in settings",
    },
    es: {
        // Layout & Navigation
        dashboard: "Panel de Control",
        history: "Historial",
        darkMode: "Modo Oscuro",
        lightMode: "Modo Claro",
        language: "Idioma",
        spanish: "Español",
        english: "Inglés",

        // Dashboard Header
        manageApps: "Gestiona tus aplicaciones",
        checking: "Buscando actualizaciones",
        refresh: "Refrescar lista",
        updateSelected: "Actualizar Seleccionados",
        readyTitle: "¡Listos cuando tú quieras!",
        readyDesc: "Pulsa el botón para escudriñar las profundidades de tu PC en busca de software obsoleto.",
        checkUpdates: "Buscar Actualizaciones",
        footerLove: "Hecho con amor por",
        footerAI: "IA incluida (principalmente para juzgar tus apps viejas).",

        // Dashboard States
        allClean: "¡Todo en orden!",
        allCleanDesc: "No hay apps rancias aquí. Está todo impecable.",
        checkAgain: "¿Miramos otra vez por si acaso?",
        selectAll: "Seleccionar Todo",
        updatesAvailable: "actualizaciones disponibles",

        // Winget Missing
        wingetMissing: "¡Falta Winget!",
        wingetMissingDesc: "Soy potente, pero no soy un hechicero. Primero tienes que instalar el App Installer de la Microsoft Store.",
        getWinget: "Instalar Winget (Abre la Microsoft Store)",

        // UpdateCard
        current: "Actual",
        new: "Nueva",
        unknown: "Desconocido",

        // Toast Notifications
        updateSuccess: "Actualizado con éxito:",
        updateFailed: "Error al actualizar:",
        updateSkipped: "omitido: No se encontró actualización aplicable",
        updateInapplicable: "Por ahora no necesitas esta versión",
        updateInapplicableDesc: "El instalador ha determinado que esta actualización no aplica a tu sistema actual.",
        updateManualUninstall: "Requiere desinstalación manual (tecnología diferente)",

        // Restore Modal
        safetyFirst: "La Seguridad es lo Primero",
        restoreAsk: "¿Creamos un punto de restauración antes?",
        restoreDesc: "Actualizar apps a veces puede poner el sistema inestable. Recomiendo crear un punto de restauración por si hay que dar marcha atrás.",
        restoreNote: "Nota: Esto tarda un par de minutos y requiere permisos de Administrador.",
        restoreFailedAbort: "El punto de restauración falló. Cancelando para proteger tu PC.",
        skipUpdate: "Omitir y Actualizar",
        skipRisk: "Rápido, pero arriesgado",
        createUpdate: "Crear y Actualizar",
        conflictTitle: "Aplicación (o Proceso) en Uso",
        conflictBody: "No puedo actualizar {app} porque sus archivos están en uso. Si no la ves abierta, es probable que sea un servicio o proceso en segundo plano.",
        conflictTip: "Tip: Revisa la bandeja del sistema. Si no está ahí, busca procesos relacionados en el Administrador de Tareas.",
        retry: "Ya la cerré, Reintentar",
        skip: "Saltar Actualización",
        statusSecurity: "Riesgo de Seguridad (Omitido)",
        recommended: "Recomendado",

        // Overlays
        creatingRestore: "Creando Punto de Restauración",
        restoreWait: "Suele tardar 30-60 segundos. Sacando una fotito al sistema antes de empezar.",
        installingUpdates: "Instalando Actualizaciones",
        updatingApp: "Actualizando",

        // Summary Modal
        summaryTitle: "Informe Post-Actualización",
        summaryDesc: "Los resultados han llegado, y son espectaculares.",
        summarySuccess: "Todo salió mejor de lo esperado. Estoy impresionado.",
        summaryPartial: "Algunas cosas funcionaron, otras no. Equilibrio universal.",
        summaryFailed: "Bueno, eso fue un desastre. Hagamos como que no pasó.",
        thanksNothing: "Vale, gracias por nada",
        closeSuccess: "¡Genial, gracias!",
        statusSuccess: "Actualizado sin una sola queja. Mi talento se desperdicia aquí.",
        statusInapplicable: "Inaplicable: Esta app ha decidido que su versión actual ya es 'perfección pura'.",
        statusFailed: "Todo está bien, excepto esto. Esto no está bien.",
        statusReboot: "Instalado, pero requiere reiniciar. No te quejes si aún no funciona.",
        statusInUse: "¡Bloqueado! Cierra la app si de verdad quieres que la actualice.",
        restartRecommendation: "Recomendación: A menos que vayas a actualizar otra cosa ahora, se recomienda reiniciar el sistema.",

        // History Status Phrases
        historySuccess: "Funcionó perfecto (contra todo pronóstico)",
        historyInapplicable: "Inaplicable: El instalador ha decidido que tu PC no es digno hoy",
        historySkipped: "Omitido porque ¿para qué hacerlo dos veces?",
        historyBroken: "Se rompió. No me mires así.",
        historyEmpty: "El historial está vacío. Como mi alma.",
        historyEmptySmall: "Empieza a instalar algo para llenar este vacío.",
        historyReboot: "Instalado, pero exige un sacrificio (un reinicio del sistema).",
        historyInUse: "Falló porque no te dio la gana cerrarlo.",
        historyRecord: "Un registro de todas las veces que me has pedido cosas.",

        // History Actions
        // History Actions
        resetApp: "Restablecer App",
        resetAppConfirm: "¿Restablecer Aplicación?",
        resetAppMessage: "Esto borrará el historial y restablecerá la configuración (idioma, bienvenida). No hay vuelta atrás.",
        confirm: "Confirmar",
        cancel: "Cancelar",

        // New UI Elements
        scanningBody: "Escanenando las profundidades de tu PC...",
        dataTransparencyTitle: "Transparencia de Datos",
        dataTransparency: "Somos claros y no invasivos. Tus opciones e historial se guardan localmente en:",

        // Onboarding
        onboardingTitle: "Bienvenido a All Updater",
        onboardingBody: "Actualizo tus aplicaciones INSTALADAS (Navegadores, Discord, Steam, etc.). NO soy Windows Update y no toco tu sistema operativo. Todo ocurre localmente.",
        onboardingBtn: "Empezar",
        onboardingDontShow: "No volver a mostrar",
        onboardingLangTitle: "Seleccione su idioma",
        onboardingLangNote: "Puede cambiarlo después en ajustes",
    }
};

export type TranslationKey = keyof typeof translations.en;
