// ========================================
// 打設量テーブルの処理
// ========================================

// 打設量テーブルの更新関数
function updatePouringVolumeTable(factoryValue) {
    const tbody = document.getElementById('pouring-volume-tbody');
    if (!tbody) return;
    
    let pouringVolumeData = [];
    
    if (factoryValue === 'tochigi-factory') {
        // 栃木工場のデータ（添付画像に基づく）
        pouringVolumeData = [
            { lineName: '栃木_Nライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_南工場', pouringVolume: '9.0', mixingVolume: '9.5', scheduledProduction: '15.0' },
            { lineName: '栃木_建築A北', pouringVolume: '0.0', mixingVolume: '0.0', scheduledProduction: '22.3' },
            { lineName: '栃木_建築B北', pouringVolume: '13.0', mixingVolume: '6.5', scheduledProduction: '32.0' },
            { lineName: '栃木_建築A南', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_建築B南', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_建築鉄筋加工場', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_RC-Aライン', pouringVolume: '0.0', mixingVolume: '0.0', scheduledProduction: '8.3' },
            { lineName: '栃木_RC-Bライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_RC-Sライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_PC-Aライン', pouringVolume: '0.0', mixingVolume: '0.0', scheduledProduction: '12.3' },
            { lineName: '栃木_PC-Bライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_PC-Cライン', pouringVolume: '0.0', mixingVolume: '0.0', scheduledProduction: '16.8' },
            { lineName: '栃木_PC-Dライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_PC-0ライン', pouringVolume: '0.0', mixingVolume: '0.0', scheduledProduction: '32.2' },
            { lineName: '栃木_ボステンヤード', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_工事倉庫前ヤード', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_食堂前ヤード', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '栃木_その他', pouringVolume: '', mixingVolume: '', scheduledProduction: '' }
        ];
    } else if (factoryValue === 'ibaraki-factory') {
        // 茨城工場のデータ
        pouringVolumeData = [
            { lineName: '茨城_Aライン', pouringVolume: '5.0', mixingVolume: '5.2', scheduledProduction: '8.0' },
            { lineName: '茨城_B1ライン', pouringVolume: '3.5', mixingVolume: '3.8', scheduledProduction: '6.5' },
            { lineName: '茨城_B2ライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '茨城_C1ライン', pouringVolume: '2.0', mixingVolume: '2.1', scheduledProduction: '4.0' },
            { lineName: '茨城_C2ライン', pouringVolume: '', mixingVolume: '', scheduledProduction: '' },
            { lineName: '茨城_Dライン', pouringVolume: '1.5', mixingVolume: '1.6', scheduledProduction: '3.0' },
            { lineName: '茨城_その他', pouringVolume: '', mixingVolume: '', scheduledProduction: '' }
        ];
    }
    
    // テーブルボディをクリア
    tbody.innerHTML = '';
    
    // データ行を生成
    pouringVolumeData.forEach(item => {
        const row = document.createElement('tr');
        const formatValue = (val) => {
            if (!val || val === '') return '';
            const num = parseFloat(val);
            return isNaN(num) ? val : num.toFixed(2);
        };
        row.innerHTML = `
            <td class="line-name-cell">${item.lineName}</td>
            <td class="pouring-volume-cell">${formatValue(item.pouringVolume)}</td>
            <td class="mixing-volume-cell">${formatValue(item.mixingVolume)}</td>
            <td class="scheduled-production-cell">${formatValue(item.scheduledProduction)}</td>
        `;
        tbody.appendChild(row);
    });
    
    // 合計値を計算して更新
    updatePouringVolumeTotals(pouringVolumeData);
}

// 打設量テーブルの合計値を計算・更新
function updatePouringVolumeTotals(data) {
    let totalPouringVolume = 0;
    let totalMixingVolume = 0;
    let totalScheduledProduction = 0;
    
    data.forEach(item => {
        if (item.pouringVolume && item.pouringVolume !== '') {
            totalPouringVolume += parseFloat(item.pouringVolume) || 0;
        }
        if (item.mixingVolume && item.mixingVolume !== '') {
            totalMixingVolume += parseFloat(item.mixingVolume) || 0;
        }
        if (item.scheduledProduction && item.scheduledProduction !== '') {
            totalScheduledProduction += parseFloat(item.scheduledProduction) || 0;
        }
    });
    
    // 合計値を表示
    const totalPouringElement = document.getElementById('total-pouring-volume');
    const totalMixingElement = document.getElementById('total-mixing-volume');
    const totalScheduledElement = document.getElementById('total-scheduled-production');
    const percentageElement = document.getElementById('percentage-display');
    
    if (totalPouringElement) {
        totalPouringElement.textContent = totalPouringVolume.toFixed(2);
    }
    if (totalMixingElement) {
        totalMixingElement.textContent = totalMixingVolume.toFixed(2);
    }
    if (totalScheduledElement) {
        totalScheduledElement.textContent = totalScheduledProduction.toFixed(2);
    }
    
    // パーセンテージを計算（予定生産量に対する打設量の割合）
    const percentage = totalScheduledProduction > 0 ? (totalPouringVolume / totalScheduledProduction * 100) : 0;
    if (percentageElement) {
        percentageElement.textContent = percentage.toFixed(1) + '%';
    }
}
