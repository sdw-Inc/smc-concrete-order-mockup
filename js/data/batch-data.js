// ========================================
// バッチデータ定義（注文済みデータの子データ）
// ========================================

// バッチデータの定義
// 各注文済みデータに対して、1.3㎥ずつ分割したバッチ情報を管理
const batchData = {
    // キー形式: 'factory_line_orderIndex_batchIndex'
    // 例: 'tochigi-factory_栃木_建築A北_0_0' (tochigi-factoryの栃木_建築A北の0番目の注文の0番目のバッチ)
};

// バッチデータを取得する関数
function getBatchData(factory, line, orderIndex, batchIndex) {
    const key = `${factory}_${line}_${orderIndex}_${batchIndex}`;
    return batchData[key] || null;
}

// バッチデータを設定する関数
function setBatchData(factory, line, orderIndex, batchIndex, data) {
    const key = `${factory}_${line}_${orderIndex}_${batchIndex}`;
    batchData[key] = data;
}

// 注文データのキーからバッチデータを取得する関数
function getBatchDataByOrderKey(orderDataKey, batchIndex) {
    const key = `${orderDataKey}_${batchIndex}`;
    return batchData[key] || null;
}

// 注文データのキーからバッチデータを設定する関数
function setBatchDataByOrderKey(orderDataKey, batchIndex, data) {
    const key = `${orderDataKey}_${batchIndex}`;
    batchData[key] = data;
}

// 注文データのキーに紐づくすべてのバッチデータを取得する関数
function getAllBatchDataByOrderKey(orderDataKey) {
    const result = [];
    let batchIndex = 0;
    while (true) {
        const key = `${orderDataKey}_${batchIndex}`;
        if (batchData[key]) {
            result.push(batchData[key]);
            batchIndex++;
        } else {
            break;
        }
    }
    return result;
}

