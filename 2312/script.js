document.addEventListener('DOMContentLoaded', function () {
    const contentArea = document.querySelector('.content');
    const toc = document.querySelector('#toc');
    toc.innerHTML = ''; // 既存の目次をクリア

    // 適切なヘッダータグを取得する関数
    function findHeader(section, level) {
        for (let i = 1; i <= 6; i++) {
            const header = section.querySelector(`h${i}`);
            if (header && section.contains(header)) {
                return header;
            }
        }
        return null; // ヘッダーが見つからない場合
    }

    // 目次を生成する関数
    function generateToc(container) {
        let counters = [0];
        const tocFragment = document.createDocumentFragment();

        Array.from(container.querySelectorAll('.section')).forEach(section => {
            const level = parseInt(section.dataset.level);
            while (counters.length < level) {
                counters.push(0);
            }
            counters = counters.slice(0, level);
            counters[counters.length - 1]++;

            const number = counters.join('.') + '.';
            const header = findHeader(section, level);
            if (header) {
                header.innerHTML = number + ' ' + header.innerText;
            }

            // 目次のリンクを作成
            const tocLink = document.createElement('a');
            tocLink.href = '#' + section.id;
            tocLink.innerHTML = header ? header.innerText : '';
            tocLink.addEventListener('click', function (e) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth' });
            });
            tocFragment.appendChild(tocLink);
        });

        // 目次にリンクを追加
        toc.appendChild(tocFragment);
    }

    // 目次とセクション番号を生成
    generateToc(contentArea);

    // リンクのクリックイベントリスナーを設定
    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
