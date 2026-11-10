
export const indexToSource = (index: number) => {
    const sourceArr = [
        require('@/assets/images/altj.png'),
        require('@/assets/images/currents.png'),
        require('@/assets/images/headlights.png')
    ];
    return sourceArr[index];
}