// ========================================
// ラインエリア - バッチ情報処理
// ========================================

// バッチ情報関連の初期化
function initializeLineAreaBatchInfo() {
    // バッチ情報画面が表示された時の初期化処理
}

// バッチ情報テキストのオーバーフローをチェックする関数
function checkBatchInfoTextOverflow() {
    const batchInfoSections = document.querySelectorAll('.batch-info-section');
    batchInfoSections.forEach(section => {
        // セクション内のカルーセル構造またはテキスト要素を取得
        const existingCarousel = section.querySelector('.batch-info-carousel');
        const existingText = section.querySelector('.batch-info-text:not([aria-hidden])');
        
        // テキスト要素を取得（カルーセル構造内の場合は最初のテキスト、そうでない場合は直接のテキスト）
        let textElement;
        let textContent;
        let textClasses;
        
        if (existingCarousel) {
            // 既存のカルーセル構造がある場合
            const firstText = existingCarousel.querySelector('.batch-info-text:not([aria-hidden])');
            if (firstText) {
                textElement = firstText;
                textContent = firstText.textContent;
                textClasses = firstText.className;
            } else {
                return; // テキスト要素が見つからない場合はスキップ
            }
        } else if (existingText) {
            // 通常のテキスト要素がある場合
            textElement = existingText;
            textContent = existingText.textContent;
            textClasses = existingText.className;
        } else {
            return; // テキスト要素が見つからない場合はスキップ
        }
        
        // オーバーフロークラスを一旦削除
        textElement.classList.remove('overflowing');
        
        // テキストの幅とコンテナの幅を比較
        const containerWidth = section.clientWidth;
        
        // テキストの実際の幅を測定
        let textWidth;
        if (existingCarousel) {
            // カルーセル構造内の場合は、一時的な要素を作成して測定
            const tempElement = document.createElement('div');
            tempElement.className = textClasses;
            tempElement.textContent = textContent;
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.display = 'inline-block';
            // スタイルをコピー
            const computedStyle = window.getComputedStyle(textElement);
            tempElement.style.fontSize = computedStyle.fontSize;
            tempElement.style.fontWeight = computedStyle.fontWeight;
            tempElement.style.fontFamily = computedStyle.fontFamily;
            tempElement.style.letterSpacing = computedStyle.letterSpacing;
            document.body.appendChild(tempElement);
            textWidth = tempElement.scrollWidth;
            document.body.removeChild(tempElement);
        } else {
            // 通常のテキスト要素の場合は、直接scrollWidthを使用
            textWidth = textElement.scrollWidth;
        }
        
        // テキストがはみ出している場合のみカルーセル構造を作成
        if (textWidth > containerWidth) {
            // 既にカルーセル構造がある場合は、テキスト内容を更新するだけ
            if (existingCarousel) {
                const groups = existingCarousel.querySelectorAll('.batch-info-group');
                groups.forEach(group => {
                    // 各グループ内のテキスト要素を更新
                    const texts = group.querySelectorAll('.batch-info-text');
                    texts.forEach(text => {
                        text.textContent = textContent;
                        text.className = textClasses;
                    });
                });
            } else {
                // カルーセル構造を作成
                const carousel = document.createElement('div');
                carousel.className = 'batch-info-carousel';
                
                // 最初のグループを作成（元のテキストを含む）
                const group1 = document.createElement('div');
                group1.className = 'batch-info-group';
                
                const originalClone = textElement.cloneNode(true);
                originalClone.textContent = textContent;
                originalClone.className = textClasses;
                group1.appendChild(originalClone);
                
                carousel.appendChild(group1);
                
                // 2番目のグループを作成（複製テキストを含む、aria-hidden付き）
                const group2 = document.createElement('div');
                group2.className = 'batch-info-group';
                group2.setAttribute('aria-hidden', 'true');
                
                const duplicateClone = textElement.cloneNode(true);
                duplicateClone.textContent = textContent;
                duplicateClone.className = textClasses;
                group2.appendChild(duplicateClone);
                
                carousel.appendChild(group2);
                
                // 元のテキスト要素をカルーセルで置き換え
                textElement.parentElement.replaceChild(carousel, textElement);
            }
        } else {
            // テキストがはみ出していない場合、カルーセル構造を削除して通常表示に戻す
            if (existingCarousel) {
                // カルーセル構造内の最初のテキスト要素を取得
                const firstText = existingCarousel.querySelector('.batch-info-text:not([aria-hidden])');
                if (firstText) {
                    const savedTextContent = firstText.textContent;
                    const savedTextClasses = firstText.className.replace('overflowing', '').trim();
                    
                    // 新しいテキスト要素を作成
                    const newTextElement = document.createElement('div');
                    newTextElement.className = savedTextClasses || 'batch-info-text';
                    newTextElement.textContent = savedTextContent;
                    
                    // カルーセルを新しいテキスト要素で置き換え
                    existingCarousel.parentElement.replaceChild(newTextElement, existingCarousel);
                }
            }
        }
    });
}

// バッチ情報を更新する関数
function updateBatchInfo(batchId, info) {
    const batchElement = document.querySelector(`[data-batch-id="${batchId}"]`);
    if (batchElement) {
        // バッチ情報を更新
        Object.keys(info).forEach(key => {
            const element = batchElement.querySelector(`[data-field="${key}"]`);
            if (element) {
                element.textContent = info[key];
            }
        });
        
        // 更新後にオーバーフローチェックを実行
        setTimeout(() => {
            checkBatchInfoTextOverflow();
        }, 100);
    }
}

// バッチ情報の表示/非表示を制御する関数
function toggleBatchInfoVisibility(batchId, visible) {
    const batchElement = document.querySelector(`[data-batch-id="${batchId}"]`);
    if (batchElement) {
        batchElement.style.display = visible ? 'block' : 'none';
    }
}

// バッチ情報をフィルタリングする関数
function filterBatchInfo(filterCriteria) {
    const batchElements = document.querySelectorAll('[data-batch-id]');
    
    batchElements.forEach(element => {
        const status = element.querySelector('[data-field="status"]')?.textContent || '';
        const priority = element.querySelector('[data-field="priority"]')?.textContent || '';
        
        let shouldShow = true;
        
        if (filterCriteria.status && status !== filterCriteria.status) {
            shouldShow = false;
        }
        
        if (filterCriteria.priority && priority !== filterCriteria.priority) {
            shouldShow = false;
        }
        
        element.style.display = shouldShow ? 'block' : 'none';
    });
}

// バッチ情報をソートする関数
function sortBatchInfo(sortBy, ascending = true) {
    const batchContainer = document.querySelector('.batch-info-container');
    if (!batchContainer) return;
    
    const batchElements = Array.from(batchContainer.querySelectorAll('[data-batch-id]'));
    
    batchElements.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'time':
                valueA = a.querySelector('[data-field="time"]')?.textContent || '';
                valueB = b.querySelector('[data-field="time"]')?.textContent || '';
                break;
            case 'status':
                valueA = a.querySelector('[data-field="status"]')?.textContent || '';
                valueB = b.querySelector('[data-field="status"]')?.textContent || '';
                break;
            case 'priority':
                valueA = a.querySelector('[data-field="priority"]')?.textContent || '';
                valueB = b.querySelector('[data-field="priority"]')?.textContent || '';
                break;
            default:
                return 0;
        }
        
        const comparison = valueA.localeCompare(valueB);
        return ascending ? comparison : -comparison;
    });
    
    // ソートされた順序でDOMに再配置
    batchElements.forEach(element => batchContainer.appendChild(element));
}
