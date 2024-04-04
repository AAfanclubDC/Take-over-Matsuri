function generatePartyB(PartyA) {
    var article = document.createElement('article');
    article.id = "PartyB";
    article.className = 'box post post-excerpt';
    // 創建header並設置標題
    const header = document.createElement('header');
    const h2 = document.createElement('h2');
    const aTitle = document.createElement('a');
    aTitle.textContent = "這個設定由這些群友承包了";
    h2.appendChild(aTitle);
    header.appendChild(h2);
    article.appendChild(header);
    // 加載 JSON 檔案
    fetch('data/繳交情況.json') // 假設您的 JSON 文件位於 data 目錄下
        .then(response => response.json())
        .then(data => {
            // 處理每一筆資料
            data.forEach(player => {
                if(player.PartyA !=PartyA){
                    return;
                }
                const src = "images/players/" + player.PartyB + ".png";
                if(player.style == "圖片")
                {
                    url = "gallery.html?PartyA=" + player.PartyA + "&PartyB="+ player.PartyB ; // 
                }else if(player.style == "網頁")
                {
                    url = "pieces/"+ player.Title + ".html" ; 
                }
                const button = generateButton(src, player.Title, url);
                article.appendChild(button);
            });
            document.getElementById('content').appendChild(article);
        })
        .catch(error => console.error('Error loading the JSON file:', error));
    }


    function loadEntrust(key) {
        return fetch('data\\委託單.json') // 確保返回承諾
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty(key)) {
                    return data[key]; // 正確的值將被返回
                } else {
                    throw new Error("no such PartyA"); // 使用 throw 而不是 return 來處理錯誤
                }
            })
            .catch(error => {
                console.error("Error fetching or parsing data:", error);
                throw error; // 向上拋出錯誤
            });
    }
    
    
    
    
    async function route() {
        const app = document.getElementById('content');
        let PartyA = getQueryParam('PartyA');
        let PartyB = getQueryParam('PartyB');
        if (!PartyA) {
            displayDefaultContent();
            return; // 結束函數執行
        } if (!PartyB) {
            try {
                const data = await loadEntrust(PartyA);
                removeAllChildren();
                // 創建article元素
                const article = document.createElement('article');
                article.className = 'box post post-excerpt';
    
                // 創建header並設置標題
                const header = document.createElement('header');
                const h2 = document.createElement('h2');
                const aTitle = document.createElement('a');
                aTitle.textContent = data['標題'];
                h2.appendChild(aTitle);
                header.appendChild(h2);
                article.appendChild(header);
    
                const text = document.createElement('p');
                text.innerHTML = data.content.replace(/\n/g, '<br>');
                article.appendChild(text);
                document.getElementById('content').appendChild(article);
                generatePartyB(PartyA);
                // 在這裡處理 content
            } catch (error) {
                console.error("Error:", error);
            }
        } else
        {
            console.log("--------------");
            loadData(PartyA,PartyB);
        }
    
    }
    
    // 當網址路徑或查詢參數變化時，重新執行路由函數
    window.addEventListener('popstate', route);
    
    // 初始加載時也執行路由函數
    window.onload = route;
    