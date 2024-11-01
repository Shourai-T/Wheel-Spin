function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return { r, g, b };
}

function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = [];
let currentDeg = 0;
let step = 0;
let colors = [];
let itemDegs = {};
let speed = 0;
let maxRotation = 0;
let pause = false;
let lastWinner = null;

document.addEventListener("DOMContentLoaded", async () => {
    await fetchPrizes();  // Tải danh sách phần thưởng từ cơ sở dữ liệu
    createWheel();        // Vẽ vòng quay với danh sách phần thưởng
});

const drawWheel = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(33,33,33)`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    let startDeg = currentDeg;
    items.forEach((item, i) => {
        const endDeg = startDeg + step;
        const color = colors[i];
        ctx.fillStyle = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";

        // Điều chỉnh font chữ dựa trên độ dài của text
        let fontSize = 24;
        if (items[i].length > 15) fontSize = 16;
        else if (items[i].length > 10) fontSize = 20;

        ctx.font = `bold ${fontSize}px serif`;
        ctx.fillStyle = color.r > 150 || color.g > 150 || color.b > 150 ? "#000" : "#fff";
        
        let displayText = items[i].length > 20 ? items[i].slice(0, 17) + "..." : items[i];
        ctx.fillText(displayText, 130, 10);
        ctx.restore();

        itemDegs[item] = { startDeg, endDeg };
        startDeg += step;
    });
};

const createWheel = () => {
    step = 360 / items.length;
    colors = items.map(() => randomColor());
    itemDegs = {};
    drawWheel();
};

const resetWheel = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createWheel();
};

// const checkWinner = () => {
//     const winningDeg = (currentDeg % 360 + 360) % 360;
//     const triangleDeg = 360;

//     items.some(item => {
//         const { startDeg, endDeg } = itemDegs[item];
//         const start = startDeg % 360;
//         const end = endDeg % 360;
//         const isWinner = triangleDeg >= start && triangleDeg < end || (start > end && (triangleDeg >= start || triangleDeg < end));
//         if (isWinner) {
//             document.getElementById("winnerMessage").innerText = `Bạn đã trúng "${item}"!`;
//             document.getElementById("winnerModal").style.display = 'flex';
//             lastWinner = item;
//             updatePrize(item); // Gọi API để cập nhật số lượng phần thưởng
//             return true;
//         }
//         return false;
//     });
// };

const checkWinner = () => {
    const winningDeg = (currentDeg % 360 + 360) % 360;
    const triangleDeg = 360;

    // Tạo danh sách phần thưởng dựa trên xác suất
    let prizePool = [];
    items.forEach((item) => {
        const { probability } = itemDegs[item];
        const count = Math.round(probability * 100); // Tính số lần xuất hiện dựa trên xác suất
        for (let i = 0; i < count; i++) {
            prizePool.push(item);
        }
    });

    // Lấy phần thưởng từ prizePool
    const randomIndex = Math.floor(Math.random() * prizePool.length);
    const selectedPrize = prizePool[randomIndex];

    // Hiển thị phần thưởng đã trúng
    document.getElementById("winnerMessage").innerText = `Bạn đã trúng "${selectedPrize}"!`;
    document.getElementById("winnerModal").style.display = 'flex';
    lastWinner = selectedPrize;
}


const animate = () => {
    if (pause) return;
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        checkWinner();
        return;
    }
    currentDeg += speed;
    drawWheel();
    requestAnimationFrame(animate);
};

const spin = () => {
    if (speed !== 0) return;
    currentDeg = 0;
    maxRotation = randomRange(1080, 2160);
    pause = false;
    createWheel();
    requestAnimationFrame(animate);
};

const closeModal = () => {
    document.getElementById("winnerModal").style.display = 'none';
};

async function fetchPrizes() {
    try {
        const response = await fetch('get_gift.php');
        const gifts = await response.json();
        items = gifts.map(gift => gift.name); // Chuyển danh sách phần thưởng vào `items`
        createWheel(); // Vẽ vòng quay với danh sách phần thưởng
    } catch (error) {
        console.error('Error fetching gifts:', error);
    }
}

function updatePrize(prize) {
    fetch('update_gift.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `giftName=${encodeURIComponent(prize)}`,
    })
    .then(response => response.text())
    .then(() => {
        console.log(`Đã cập nhật số lượng cho phần thưởng ${prize}`);
        fetchPrizes(); // Cập nhật lại danh sách phần thưởng
    })
    .catch(error => console.error('Error updating gift:', error));
}
