// ========================================
// プラントエリア - メイン初期化処理
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 画面遷移イベントの設定
    setupScreenNavigationEvents();
    
    // 現在のページに応じてscreen-selectorの選択状態を設定
    const currentPath = window.location.pathname;
    if (currentPath.includes('production-instruction.html')) {
        updateAllScreenSelectors('production-instruction');
    } else if (currentPath.includes('batch-history.html')) {
        updateAllScreenSelectors('batch-history');
    }
    
    // 現在のページに応じて必要な初期化処理を実行
    
    // 生産指示画面の場合
    if (currentPath.includes('production-instruction.html')) {
        // 生産指示画面の初期化
        initializeProductionInstructionScreen();
        
        // 注文テーブルの初期化
        initializeOrderTable();
        
        // 日付セルクリック処理の初期化
        setupDateCellClickHandlers();
        
        // 選択解除ボタンの初期化
        setupClearSelectionButton();
        
        // 注文削除モーダルの初期化
        initializeDeleteOrderModal();
    }
    
    // バッチ履歴画面の場合
    if (currentPath.includes('batch-history.html')) {
        // バッチ履歴テーブルの初期化（フィルタリングなしで全データ表示）
        renderBatchHistoryTable(false);
        
        // 工場セレクターのイベント設定
        setupBatchHistoryFactorySelectorEvents();
        
        // 検索ボタンのイベント設定
        setupSearchButtonEvents();
    }
});
