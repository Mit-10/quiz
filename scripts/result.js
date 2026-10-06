(function () {
    const Result = {
        init(){

            const url = new URL(location.href);

            const score = url.searchParams.get('score');
            const total = url.searchParams.get('total');
            const testId = url.searchParams.get('id');


            document.getElementById('result-score').innerText = score + '/' + total;

            document.getElementById('open-answers').href = 'answers.html?id=' + testId;
        }
    }
    Result.init();
})();