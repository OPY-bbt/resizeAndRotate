const box = document.querySelector('.box');
const draggable = document.querySelector('.draggable');
const resizable = document.querySelector('.resizable');
const rotate = document.querySelector('.rotate');
const resizePoints = resizable.querySelectorAll('span');

const pos = {
    width: 300,
    height: 200,
    top: 300,
    left: 300,
    rotate: 0,
};

const draw = () => {
    const style = box.style;
    style.width = `${pos.width}px`;
    style.height = `${pos.height}px`;
    style.top = `${pos.top}px`;
    style.left = `${pos.left}px`;
    style.transform = `rotate(${pos.rotate}deg)`;
}

var rotateStartPos = {};
var rotateStartEv = {};
var isRotating = false;
rotate.addEventListener('mousedown', (ev) => {
    isRotating = true;
    rotateStartPos = {...pos};
    rotateStartEv = ev;
    var centerPos = getCenterPoint(pos);

    const move = (e) => {
        if (!isRotating) {
            return;
        }
    
        const { pageX, pageY } = e;
    
        const startVector = getVector(centerPos, [rotateStartEv.pageX, rotateStartEv.pageY]);
        const moveVector = getVector(centerPos, [pageX, pageY]);
    
        // 求夹角弧度
        const radian = Math.acos(getVectorPointMultiplication(startVector, moveVector) / (getVectorModulus(startVector) * getVectorModulus(moveVector)));
        
        // 叉乘判断方向
        const dir = getVectorCrossMultiplication(startVector, moveVector) > 0 ? 1 : -1;
    
        const angle = rotateStartPos.rotate + radian * (180 / Math.PI) * dir;
    
        pos.rotate = angle;
        draw();
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', (_) => {
        isRotating = false;
    });
});

const oppositeVertexesIndices = [7, 6, 5, 4, 3, 2, 1, 0];

const calcEightVertexes = (rect) => {
    // center is [x + w / 2, -(y + h / 2)];
    const vertexesInRectAxis = getVertexesInRectAxis(rect);
    const rotatedVertexesInRectAxis = vertexesInRectAxis.map(v => getPointAfterRotation(v, rect.rotate));

    const vertexesInEventAxis = rotatedVertexesInRectAxis.map(v => [v[0] + rect.left + rect.width / 2, v[1] - rect.top - rect.height / 2]);
    return vertexesInEventAxis;
}

const getDistanceBetweenVertexes = (v1, v2) => {
    return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2));
}

const getVertexesInRectAxis = (rect) => {
    const { width: w, height: h } = rect;
    return [
        [-w / 2, h / 2],
        [0, h / 2],
        [w / 2, h / 2],
        [-w / 2, 0],
        [w / 2, 0],
        [-w / 2, -h / 2],
        [0, -h / 2],
        [w / 2, -h / 2],
    ];
}

// 顺时针旋转angle角度后点的位置
const getPointAfterRotation = (point, angle) => {
    const radian = angle * (Math.PI / 180);
    return [
        point[0] * Math.cos(radian) + point[1] * Math.sin(radian),
        point[1] * Math.cos(radian) - point[0] * Math.sin(radian),
    ];
}

var isResizing = false;

var _mouseDownVertexes;
var _mouseDownPoint;
var _mouseDownPos;

resizePoints.forEach((point, vertexIndex) => {
    point.addEventListener('mousedown', (e) => {
        isResizing = true;

        const oppositeVertexIndex = oppositeVertexesIndices[vertexIndex];
        resizePoints[oppositeVertexIndex].style.background = '#000';

        _mouseDownVertexes = calcEightVertexes(pos);

        _mouseDownPoint = [e.pageX, -e.pageY];
        _mouseDownPos = {...pos};

        const move = (e) => {
            if (!isResizing) {
                return;
            }
    
            const x = e.pageX;
            const y = -e.pageY;

            const oppositeVertexIndex = oppositeVertexesIndices[vertexIndex];
            const oppositeVertex = _mouseDownVertexes[oppositeVertexIndex];
            
            const ratio = {w: 1, h: 1};
            if (vertexIndex == 1 || vertexIndex == 6) {
                // 仅改变高度。
                ratio.h = getDistanceBetweenVertexes([x, y], oppositeVertex) / _mouseDownPos.height;
            } else if (vertexIndex == 3 || vertexIndex == 4) {
                // 仅改变宽度
                ratio.w = getDistanceBetweenVertexes([x, y], oppositeVertex) / _mouseDownPos.width;
            } else {
                // 改变宽度和高度。
                ratio.w = ratio.h = getDistanceBetweenVertexes([x, y], oppositeVertex) / getDistanceBetweenVertexes(_mouseDownPoint, oppositeVertex);
            }

            pos.width = _mouseDownPos.width * ratio.w;
            pos.height = _mouseDownPos.height * ratio.h;

            const resizedVertexes = calcEightVertexes({
                ..._mouseDownPos,
                width: pos.width,
                height: pos.height,
            });

            var resizedOppositeVertexes = resizedVertexes[oppositeVertexIndex];
            
            pos.left = _mouseDownPos.left - (resizedOppositeVertexes[0] - _mouseDownVertexes[oppositeVertexIndex][0]);
            pos.top = _mouseDownPos.top + (resizedOppositeVertexes[1] - _mouseDownVertexes[oppositeVertexIndex][1]);

            draw();
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move);

            isResizing = false;
            const oppositeVertexIndex = oppositeVertexesIndices[vertexIndex];
            resizePoints[oppositeVertexIndex].style.background = '#FFF';
        });
    });
})

draw();