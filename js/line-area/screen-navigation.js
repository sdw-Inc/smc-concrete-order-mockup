// ========================================
// ラインエリア - 画面遷移制御
// ========================================

// 画面遷移イベントの設定
function setupLineAreaScreenNavigation() {
    // ログインボタンのクリックイベント（共通ログイン画面で処理されるため、ここでは不要）
    // const loginBtn = document.querySelector('.login-btn');
    // if (loginBtn) {
    //     loginBtn.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         const currentPath = window.location.pathname;
    //         const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    //         window.location.href = basePath + '/order.html';
    //     });
    // }

    // 画面セレクターの変更イベント
    setupLineAreaScreenSelectorEvents();
    
    // 戻るボタンのクリックイベント
    setupBackButtonEvents();
    
    // ログアウトボタンのクリックイベント
    setupLogoutButtonEvents();
}

// 画面セレクターのイベント設定
function setupLineAreaScreenSelectorEvents() {
    const screenSelectors = document.querySelectorAll('.screen-selector');
    screenSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const selectedValue = this.value;
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            
            if (selectedValue === 'batch-info') {
                window.location.href = basePath + '/batch-info.html';
            } else if (selectedValue === 'production-instruction') {
                window.location.href = basePath + '/production-instruction.html';
            } else if (selectedValue === 'order') {
                window.location.href = basePath + '/order.html';
            }
        });
    });
}

// 戻るボタンのイベント設定
function setupBackButtonEvents() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath + '/order.html';
        });
    }
}

// ログアウトボタンのイベント設定
function setupLogoutButtonEvents() {
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath.replace('/line-area', '') + '/index.html';
        });
    });
}

// すべての画面セレクターを更新する関数
function updateAllScreenSelectors(value) {
    const screenSelectors = document.querySelectorAll('.screen-selector');
    screenSelectors.forEach(selector => {
        selector.value = value;
    });
}

// 画面表示制御関数
function showScreen(screenId) {
    // 開いているモーダルをすべて閉じる
    closeAllModals();
    
    // すべての画面を非表示
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // 指定された画面を表示
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // バッチ情報画面の場合、テキストのオーバーフローをチェック
        if (screenId === 'batch-info-screen') {
            // 少し遅延させてからチェック（DOMの更新を待つ）
            setTimeout(() => {
                checkBatchInfoTextOverflow();
            }, 100);
        }
        
        // 生産指示画面の場合、初期化処理を実行
        if (screenId === 'production-instruction-screen') {
            setTimeout(() => {
                initializeLineProductionInstructionScreen();
            }, 100);
        }
    }
}
