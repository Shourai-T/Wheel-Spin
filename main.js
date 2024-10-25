(() => {
    const $ = document.querySelector.bind(document);

    let timeRotate = 7000; // 7 giây
    let currentRotate = 0;
    let isRotating = false;
    const wheel = $('.wheel');
    const btnWheel = $('.btn--wheel');
    const showMsg = $('.msg');

    // Danh sách phần thưởng
    let listGift = [
        { text: '1' },
        { text: '2' },
        { text: '3' },
        { text: '4' },
        { text: '5' },
        { text: '6' },
    ];

    const resetWheel = () => {
        wheel.innerHTML = '';
        createWheel();
    };

    const createWheel = () => {
        const rotate = 360 / listGift.length;
        const skewY = 90 - rotate;

        listGift.forEach((item, index) => {
            const elm = document.createElement('li');
            elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;
            elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg);" class="text ${index % 2 === 0 ? 'text-1' : 'text-2'}"><b>${item.text}</b></p>`;
            wheel.appendChild(elm);
        });
    };

    createWheel();

    // Thêm phần thưởng mới
    const giftNameInput = document.getElementById('giftName');
    const addGiftBtn = document.getElementById('addGift');
    const removeGiftBtn = document.getElementById('removeGift');

    addGiftBtn.addEventListener('click', () => {
        const names = giftNameInput.value.trim().split(',').map(name => name.trim());

        names.forEach(name => {
            if (name) {
                listGift.push({ text: name });
                alert(`Đã thêm phần thưởng: ${name}`);
            }
        });

        if (names.length > 0) {
            resetWheel();
        } else {
            alert('Vui lòng nhập tên hợp lệ!');
        }

        giftNameInput.value = '';
    });

    // Xóa phần thưởng cuối cùng
    removeGiftBtn.addEventListener('click', () => {
        if (listGift.length > 0) {
            const removedGift = listGift.pop();
            alert(`Đã xóa phần thưởng: ${removedGift.text}`);
            resetWheel();
        } else {
            alert('Không còn phần thưởng nào để xóa!');
        }
    });

    const start = () => {
        showMsg.innerHTML = '';
        isRotating = true;
        const random = Math.random();
        const gift = getGift(random);
        currentRotate += 360 * 10;
        rotateWheel(currentRotate, gift.index);
        showGift(gift);
    };

    const rotateWheel = (currentRotate, index) => {
        $('.wheel').style.transform = `rotate(${currentRotate - index * (360 / listGift.length) - (360 / listGift.length) / 2}deg)`;
    };

    const getGift = randomNumber => {
        let currentPercent = 0;
        let list = [];
        listGift.forEach((item, index) => {
            currentPercent += 1 / listGift.length;
            if (randomNumber <= currentPercent) {
                list.push({ ...item, index });
            }
        });
        return list[0];
    };

    const showGift = gift => {
        let timer = setTimeout(() => {
            isRotating = false;
            showMsg.innerHTML = `Chúc mừng bạn đã nhận được "${gift.text}"`;
            clearTimeout(timer);
        }, timeRotate);
    };

    btnWheel.addEventListener('click', () => {
        !isRotating && start();
    });
})();
