// ========================================
// ラインエリア - 注文明細テーブルデータ定義
// ========================================

// 注文明細テーブルデータの定義
const lineOrderDetailsData = {
    'tochigi-factory': {
        '栃木_建築A北': [
            {
                id: '1CX1Y4',
                time: '5:50',
                line: '栃木_建築A北',
                project: '〇〇ビル新築工事',
                orderNo: '1',
                unloadingNo: '1',
                formworkNo: 'No.4',
                strength: '60N',
                mixNo: '77777',
                m3: 5.5,
                volume: 5.5,
                batcher: '第2',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 5.5,
                batches: [
                    { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '5:50', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-3', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-3', m3: 0.6, volume: 0.6, time: '6:20', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' }
                ]
            },
            {
                id: '1CX1Y4',
                time: '6:34',
                line: '栃木_建築A北',
                project: '〇〇ビル新築工事',
                orderNo: '2',
                unloadingNo: '1',
                formworkNo: 'No.4',
                strength: '30N',
                mixNo: '77777',
                m3: 3.5,
                volume: 3.5,
                batcher: '第2',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 3.5,
                batches: [
                    { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '5:50', strength: '30N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:00', strength: '30N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-3', m3: 0.9, volume: 0.9, time: '6:10', strength: '30N', project: '〇〇ビル新築工事', status: '出荷済' }
                ]
            },
            {
                id: '1CX1Y1 1CX1Y7',
                time: '7:23',
                line: '栃木_建築A北',
                project: '〇〇ビル新築工事',
                orderNo: '3',
                unloadingNo: '1',
                formworkNo: 'No.1 No.8',
                strength: '60N',
                mixNo: '77777',
                m3: 11.4,
                volume: 11.4,
                batcher: '第2',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 1.3,
                batches: [
                    { batchNo: '3-1', m3: 1.3, volume: 1.3, time: '5:50', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '3-2', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇ビル新築工事', status: '練混中' },
                    { batchNo: '3-3', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-4', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-5', m3: 1.3, volume: 1.3, time: '6:30', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-6', m3: 1.3, volume: 1.3, time: '6:40', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-7', m3: 1.3, volume: 1.3, time: '6:50', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-8', m3: 1.3, volume: 1.3, time: '7:00', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '3-9', m3: 1.0, volume: 1.0, time: '7:10', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' }
                ]
            },
            {
                id: '1CX1Y1',
                time: '7:43',
                line: '栃木_建築A北',
                project: '〇〇ビル新築工事',
                orderNo: '4',
                unloadingNo: '1',
                formworkNo: 'No.1',
                strength: '60N',
                mixNo: '77777',
                m3: 6.12,
                volume: 6.12,
                batcher: '第2',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 0,
                batches: [
                    { batchNo: '4-1', m3: 1.3, volume: 1.3, time: '5:50', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '4-2', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '4-3', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '4-4', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' },
                    { batchNo: '4-5', m3: 0.92, volume: 0.92, time: '6:30', strength: '60N', project: '〇〇ビル新築工事', status: '依頼中' }
                ]
            }
        ]
    },
    'ibaraki-factory': {
        '茨城_B1ライン': [
            {
                id: '1IX1Y4',
                time: '6:00',
                line: '茨城_B1ライン',
                project: '〇〇ビル新築工事',
                orderNo: '1',
                unloadingNo: '',
                formworkNo: 'No.4',
                strength: '60N',
                mixNo: '66666',
                m3: 6.1,
                volume: 6.1,
                batcher: '',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 6.1,
                batches: [
                    { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-3', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-4', m3: 1.3, volume: 1.3, time: '6:30', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-5', m3: 0.9, volume: 0.9, time: '6:40', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' }
                ]
            },
            {
                id: '1IX1Y4',
                time: '6:10',
                line: '茨城_B1ライン',
                project: '〇〇ビル新築工事',
                orderNo: '2',
                unloadingNo: '',
                formworkNo: 'No.4',
                strength: '45N',
                mixNo: '44444',
                m3: 3.5,
                volume: 3.5,
                batcher: '',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 3.5,
                batches: [
                    { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '1-3', m3: 0.9, volume: 0.9, time: '6:20', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' }
                ]
            },
            {
                id: '1IX1Y1 1IX1Y3',
                time: '7:25',
                line: '茨城_B1ライン',
                project: '〇〇ビル新築工事',
                orderNo: '3',
                unloadingNo: '',
                formworkNo: 'No.1 No.3',
                strength: '60N',
                mixNo: '66666',
                m3: 12.5,
                volume: 12.5,
                batcher: '',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 1.3,
                batches: [
                    { batchNo: '3-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇駅再開発', status: '出荷済' },
                    { batchNo: '3-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇駅再開発', status: '練混中' },
                    { batchNo: '3-3', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-4', m3: 1.3, volume: 1.3, time: '6:30', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-5', m3: 1.3, volume: 1.3, time: '6:40', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-6', m3: 1.3, volume: 1.3, time: '6:50', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-7', m3: 1.3, volume: 1.3, time: '7:00', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-8', m3: 1.3, volume: 1.3, time: '7:10', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-9', m3: 1.3, volume: 1.3, time: '7:20', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                    { batchNo: '3-10', m3: 0.8, volume: 0.8, time: '6:30', strength: '60N', project: '〇〇駅再開発', status: '依頼中' }
                ]
            },
            {
                id: '1IX1Y1',
                time: '7:56',
                line: '茨城_B1ライン',
                project: '〇〇ビル新築工事',
                orderNo: '4',
                unloadingNo: '',
                formworkNo: 'No.1',
                strength: '36N',
                mixNo: '99999',
                m3: 5.0,
                volume: 5.0,
                batcher: '',
                batchStatus: 'completed',
                batchRule: 'おまかせ',
                message: '',
                wetQuantity: 2.6,
                batches: [
                    { batchNo: '4-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '36N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '4-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '36N', project: '〇〇ビル新築工事', status: '出荷済' },
                    { batchNo: '4-3', m3: 1.1, volume: 1.1, time: '6:20', strength: '36N', project: '〇〇ビル新築工事', status: '依頼中' }
                ]
            }
        ],
        '茨城_B2ライン': [
            {
            id: '1IX1Y4',
            time: '6:00',
            line: '茨城_B1ライン',
            project: '〇〇ビル新築工事',
            orderNo: '1',
            unloadingNo: '',
            formworkNo: 'No.4',
            strength: '60N',
            mixNo: '66666',
            m3: 6.1,
            volume: 6.1,
            batcher: '',
            batchStatus: 'completed',
            batchRule: 'おまかせ',
            message: '',
            wetQuantity: 6.1,
            batches: [
                { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-3', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-4', m3: 1.3, volume: 1.3, time: '6:30', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-5', m3: 0.9, volume: 0.9, time: '6:40', strength: '60N', project: '〇〇ビル新築工事', status: '出荷済' }
            ]
        },
        {
            id: '1IX1Y4',
            time: '6:10',
            line: '茨城_B1ライン',
            project: '〇〇ビル新築工事',
            orderNo: '2',
            unloadingNo: '',
            formworkNo: 'No.4',
            strength: '45N',
            mixNo: '44444',
            m3: 3.5,
            volume: 3.5,
            batcher: '',
            batchStatus: 'completed',
            batchRule: 'おまかせ',
            message: '',
            wetQuantity: 3.5,
            batches: [
                { batchNo: '1-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '1-3', m3: 0.9, volume: 0.9, time: '6:20', strength: '45N', project: '〇〇ビル新築工事', status: '出荷済' }
            ]
        },
        {
            id: '1IX1Y1 1IX1Y3',
            time: '7:25',
            line: '茨城_B1ライン',
            project: '〇〇ビル新築工事',
            orderNo: '3',
            unloadingNo: '',
            formworkNo: 'No.1 No.3',
            strength: '60N',
            mixNo: '66666',
            m3: 12.5,
            volume: 12.5,
            batcher: '',
            batchStatus: 'completed',
            batchRule: 'おまかせ',
            message: '',
            wetQuantity: 1.3,
            batches: [
                { batchNo: '3-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '60N', project: '〇〇駅再開発', status: '出荷済' },
                { batchNo: '3-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '60N', project: '〇〇駅再開発', status: '練混中' },
                { batchNo: '3-3', m3: 1.3, volume: 1.3, time: '6:20', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-4', m3: 1.3, volume: 1.3, time: '6:30', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-5', m3: 1.3, volume: 1.3, time: '6:40', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-6', m3: 1.3, volume: 1.3, time: '6:50', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-7', m3: 1.3, volume: 1.3, time: '7:00', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-8', m3: 1.3, volume: 1.3, time: '7:10', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-9', m3: 1.3, volume: 1.3, time: '7:20', strength: '60N', project: '〇〇駅再開発', status: '依頼中' },
                { batchNo: '3-10', m3: 0.8, volume: 0.8, time: '6:30', strength: '60N', project: '〇〇駅再開発', status: '依頼中' }
            ]
        },
        {
            id: '1IX1Y1',
            time: '7:56',
            line: '茨城_B1ライン',
            project: '〇〇ビル新築工事',
            orderNo: '4',
            unloadingNo: '',
            formworkNo: 'No.1',
            strength: '36N',
            mixNo: '99999',
            m3: 5.0,
            volume: 5.0,
            batcher: '',
            batchStatus: 'completed',
            batchRule: 'おまかせ',
            message: '',
            wetQuantity: 2.6,
            batches: [
                { batchNo: '4-1', m3: 1.3, volume: 1.3, time: '6:00', strength: '36N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '4-2', m3: 1.3, volume: 1.3, time: '6:10', strength: '36N', project: '〇〇ビル新築工事', status: '出荷済' },
                { batchNo: '4-3', m3: 1.1, volume: 1.1, time: '6:20', strength: '36N', project: '〇〇ビル新築工事', status: '依頼中' }
            ]
        }
    ],
        '茨城_Aライン': [],
        '茨城_C1ライン': [],
        '茨城_C2ライン': [],
        '茨城_Dライン': [],
        '茨城_その他': []
    }
};
