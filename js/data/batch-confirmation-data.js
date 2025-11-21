// ========================================
// バッチ割確定データ定義
// ========================================

// バッチ割確定データの定義
// キー構造: batchConfirmationData[id][unit] でバッチ割データの配列を取得
const batchConfirmationData = {
    '1CX1Y1': {
        orderQuantity: {
            '60N': 5.5,
            '30N': 6.12,
            '40N': 2.12
        },
        batchMethod: {
            '60N': 'おまかせ',
            '30N': 'おまかせ',
            '40N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '練混中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 4, m3: 0.3, status: '依頼中' }
        ],
        '30N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '練混中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 4, m3: 0.92, status: '依頼中' }
        ],
        '40N': [
            { no: 1, m3: 1.0, status: '出荷済' },
            { no: 2, m3: 1.0, status: '練混中' },
            { no: 3, m3: 0.12, status: '依頼中' }
        ]
    },
    '1CX1Y3': {
        orderQuantity: {
            '60N': 5.7,
            '30N': 6.12
        },
        batchMethod: {
            '60N': '指定',
            '30N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 1.3, status: '出荷済' },
            { no: 5, m3: 0.5, status: '出荷済' }
        ],
        '30N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 1.3, status: '出荷済' },
            { no: 6, m3: 0.92, status: '出荷済' }
        ]
    },
    '1CX1Y4': {
        orderQuantity: {
            '60N': 4.5
        },
        batchMethod: {
            '60N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 0.6, status: '出荷済' }
        ]
    },
    '3EX1Y3': {
        orderQuantity: {
            '60N': 4.8
        },
        batchMethod: {
            '60N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 0.9, status: '出荷済' }
        ]
    },
    '1IX1Y1': {
        orderQuantity: {
            '60N': 6.2,
            '36N': 5.0,
            '45N': 4.5
        },
        batchMethod: {
            '60N': 'おまかせ',
            '36N': 'おまかせ',
            '45N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '練混中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 4, m3: 1.0, status: '依頼中' }
        ],
        '36N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '練混中' },
            { no: 4, m3: 1.1, status: '依頼中' }
        ],
        '45N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '練混中' },
            { no: 3, m3: 1.3, status: '依頼中' },
            { no: 4, m3: 0.6, status: '依頼中' }
        ]
    },
    '1IX1Y4': {
        orderQuantity: {
            '60N': 6.1
        },
        batchMethod: {
            '60N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 1.3, status: '出荷済' },
            { no: 5, m3: 0.9, status: '出荷済' }
        ]
    },
    '3IX1Y3': {
        orderQuantity: {
            '60N': 4.8
        },
        batchMethod: {
            '60N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 0.9, status: '出荷済' }
        ]
    },
    '3IX1Y8': {
        orderQuantity: {
            '60N': 4.4
        },
        batchMethod: {
            '60N': 'おまかせ'
        },
        '60N': [
            { no: 1, m3: 1.3, status: '出荷済' },
            { no: 2, m3: 1.3, status: '出荷済' },
            { no: 3, m3: 1.3, status: '出荷済' },
            { no: 4, m3: 0.5, status: '出荷済' }
        ]
    }
};

