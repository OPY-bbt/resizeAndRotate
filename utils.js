const getVector = (p1, p2) => {
    return [p2[0]- p1[0], p2[1] - p1[1]];
}

const getVectorModulus = (v1) => {
    return Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
}

const getVectorCrossMultiplication = (v1, v2) => {
    return v1[0] * v2[1] - v1[1] * v2[0];
}

const getVectorPointMultiplication = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

const getCenterPoint = (pos) => {
    return [pos.left + pos.width / 2, pos.top + pos.height / 2];
}