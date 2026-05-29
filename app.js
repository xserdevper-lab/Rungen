// ⚠️ เจน API KEY มาจาก Google AI Studio แล้วใส่ตรงนี้ได้เลยครับ
const GEMINI_API_KEY = "AQ.Ab8RN6Kx7bZdy5jX_vafWqTMomg1CU8EM8ZkRlR0ydc0At-OQA";

let targetCalories = 2000;
let consumedCalories = 0;

// อ้างอิงอิลิเมนต์ในหน้า HTML
const scanBtn = document.getElementById('scan-btn');
const cameraInput = document.getElementById('camera-input');
const calRemainingTxt = document.getElementById('cal-remaining');
const resultBox = document.getElementById('result-box');
const foodNameTxt = document.getElementById('food-name');
const foodPortionTxt = document.getElementById('food-portion');
const foodCalsTxt = document.getElementById('food-cals');

// คลิกปุ่มแล้วไปเปิดกล้องมือถือ
scanBtn.addEventListener('click', () => cameraInput.click());

cameraInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // แสดงสถานะกำลังโหลดแบบเท่ๆ
    scanBtn.disabled = true;
    scanBtn.innerText = "ANALYZING MEAL...";
    scanBtn.style.opacity = "0.7";

    try {
        const base64Image = await convertToBase64(file);
        const aiResponse = await callGeminiAPI(base64Image);
        
        if (aiResponse) {
            updateUI(aiResponse);
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการสแกน กรุณาลองใหม่ครับ");
        console.error(error);
    } finally {
        // คืนค่าปุ่มเดิม
        scanBtn.disabled = false;
        scanBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0x" /></svg> SCAN MEAL`;
        scanBtn.style.opacity = "1";
    }
});

// ยิงข้อมููลไปหา Gemini 1.5 Flash (รองรับรูปภาพและความเร็วสูง)
async function callGeminiAPI(base64Data) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = "Analyze this food image. Estimate portion size and calculate calories. Respond ONLY with a raw JSON object containing exact keys: 'foodName' (in Thai), 'portion' (g or plate description), 'calories' (integer value only). Do not include markdown blocks.";

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
        }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
}

// ฟังก์ชันอัปเดตตัวเลขแคลอรีและกล่องข้อมูล
function updateUI(data) {
    consumedCalories += data.calories;
    let remaining = targetCalories - consumedCalories;
    if (remaining < 0) remaining = 0;

    calRemainingTxt.innerText = remaining;
    foodNameTxt.innerText = data.foodName;
    foodPortionTxt.innerText = `ปริมาณกะประมาณ: ${data.portion}`;
    foodCalsTxt.innerText = `+${data.calories} KCAL`;

    resultBox.classList.remove('hidden');
}

// แปลงไฟล์รูปเป็น Base64 เพื่อส่งไป API
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// ลงทะเบียน Service Worker เพื่อให้เป็น PWA ติดตั้งบนมือถือได้
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("PWA Service Worker Registered"));
}
