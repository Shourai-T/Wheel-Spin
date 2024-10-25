(() => {
    const $ = document.querySelector.bind(document);

    let timeRotate = 7000; // 7 giây
    let currentRotate = 0;
    let isRotating = false;
    const wheel = $('.wheel');
    const btnWheel = $('.btn--wheel');

    // Modal elements
    const winnerModal = $('#winnerModal');
    const winnerMessage = $('#winnerMessage');
    
    // Danh sách phần thưởng
    let listGift = [
        { text: '1' },
        { text: '2' },
        { text: '3' },
        { text: '4' },
        { text: '5' },
        { text: '6' },
    ];

    winnerModal.style.display = 'none';

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

    const start = () => {
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
        setTimeout(() => {
            isRotating = false;


            // Cập nhật thông điệp và hiển thị modal
            winnerMessage.innerHTML = `Chúc mừng bạn đã nhận được "${gift.text}"`;
            winnerModal.style.display = 'flex';
        }, timeRotate);
    };

    // Đóng modal khi nhấn bên ngoài modal
    window.addEventListener('click', (event) => {
        if (event.target === winnerModal) {
            winnerModal.style.display = 'none';
        }
    });

    btnWheel.addEventListener('click', () => {
        !isRotating && start();
    });

    const giftTextarea = $('#giftTextarea');
    const updateGiftsBtn = $('#updateGifts');

    updateGiftsBtn.addEventListener('click', () => {
        const gifts = giftTextarea.value.trim().split('\n').map(item => item.trim()).filter(item => item);
        if (gifts.length > 0) {
            listGift = gifts.map(text => ({ text }));
            alert('Danh sách phần thưởng đã được cập nhật!');
            resetWheel();
        } else {
            alert('Vui lòng nhập ít nhất một phần thưởng!');
        }
    });
})();
