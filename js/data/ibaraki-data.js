// 茨城工場用データ
const ibarakiData = {
    // 練り混ぜ順エリアのデータ（茨城工場用）
    mixingOrderData: [
        {
            batchNo: "001-1",
            line: "Aライン",
            project: "世田谷小梁",
            strength: "36N",
            volume: "1.25",
            time: "09:00",
            isCompleted: false
        },
        {
            batchNo: "001-2", 
            line: "B1ライン",
            project: "渋谷再開発",
            strength: "30N",
            volume: "0.8",
            time: "09:30",
            isCompleted: false
        },
        {
            batchNo: "002-1",
            line: "C1ライン", 
            project: "新宿ビル",
            strength: "42N",
            volume: "1.5",
            time: "10:00",
            isCompleted: false
        },
        {
            batchNo: "002-2",
            line: "Dライン",
            project: "池袋駅前",
            strength: "36N", 
            volume: "1.0",
            time: "10:30",
            isCompleted: false
        },
        {
            batchNo: "003-1",
            line: "Aライン",
            project: "品川タワー",
            strength: "30N",
            volume: "0.6",
            time: "11:00",
            isCompleted: false
        }
    ],
    
    // バッチ割付・練混予定テーブルのデータ
    batchScheduleData: [
        {
            line: "Aライン",
            strength: "36N",
            cells: {
                A: { batchNo: "001-1", project: "世田谷小梁", volume: "1.25", isCompleted: false },
                B1: null,
                B2: null,
                C1: null,
                C2: null,
                D: null,
                Other: null
            }
        },
        {
            line: "B1ライン", 
            strength: "30N",
            cells: {
                A: null,
                B1: { batchNo: "001-2", project: "渋谷再開発", volume: "0.8", isCompleted: false },
                B2: null,
                C1: null,
                C2: null,
                D: null,
                Other: null
            }
        },
        {
            line: "C1ライン",
            strength: "42N", 
            cells: {
                A: null,
                B1: null,
                B2: null,
                C1: { batchNo: "002-1", project: "新宿ビル", volume: "1.5", isCompleted: false },
                C2: null,
                D: null,
                Other: null
            }
        },
        {
            line: "Dライン",
            strength: "36N",
            cells: {
                A: null,
                B1: null,
                B2: null,
                C1: null,
                C2: null,
                D: { batchNo: "002-2", project: "池袋駅前", volume: "1.0", isCompleted: false },
                Other: null
            }
        },
        {
            line: "Aライン",
            strength: "30N",
            cells: {
                A: { batchNo: "003-1", project: "品川タワー", volume: "0.6", isCompleted: false },
                B1: null,
                B2: null,
                C1: null,
                C2: null,
                D: null,
                Other: null
            }
        }
    ]
};

// データをエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ibarakiData;
}
