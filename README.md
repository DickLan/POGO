****========= 中文版本 ===========****

**專案名稱與簡介**
寶可夢 Go 帳號販售網站
主要用來協助銷售庫存的寶可夢帳號

**安裝指南**
1.  透過 git clone 或直接下載專案 zip
2.  執行 npm i 安裝所需套件
3.  確保已經安裝 MySQL 資料庫，若未安裝，可以訪問 MySQL 官網 下載並安裝。
4.  MySQL 創建一個資料庫- pogo
5.  更新專案中 MySQL 的配置，使專案能成功連接數據庫，設定位置在 config/config.json 中
6.  設定環境變數，請在 .env 中設定相關配置
7.  npm run seeds 載入種子資料
8.  npm run proStart 在生產環境運行專案
上述若正確執行
在 8. 執行後， 連接 http://localhost:3001/accounts/
應該要能看到五個種子帳號

**功能說明**
1. 可以註冊帳號，並登入登出
2. 可以增加條件來搜尋帳號，如等級、星砂、價格...等
3. 可以直接透過右下角聊天視窗，和管理員即時交談
4. 登入後，可以將喜歡的帳號加入、移除購物車
5. 可以按照價格排序帳號
6. 可以在右上角切換顯示語言，目前僅支援中文、英文

**聯繫方式**
discord : linco0357



****========= English Guide ===========****

**Project Name and Description**
Pokémon Go Account Sales Website

This website is primarily used to facilitate the sale of inventory Pokémon accounts.


**Installation Guide**
* 		Download the project via git clone or direct download of the project zip.
* 		Run npm i to install required packages.
* 		Ensure MySQL Database is installed. If not, it can be downloaded from the MySQL official website.
* 		Create a database named 'pogo' in MySQL.
* 		Update MySQL configuration in the project to successfully connect to the database. The settings are located in config/config.json.
* 		Set environment variables in the .env file with the relevant configurations.
* 		Run npm run seeds to load seed data.
* 		Run npm run proStart to run the project in production environment.
* 		If the above steps are correctly executed, after step 8, connecting to http://localhost:3001/accounts/ should display five seed accounts.

**Features**
* 		Users can register an account and log in/out.
* 		Search for accounts with specific criteria such as level, stardust, price, etc.
* 		Directly chat with the administrator in real-time via the chat window in the bottom right corner.
* 		After logging in, users can add/remove favorite accounts to/from the shopping cart.
* 		Sort accounts by price.
* 		Switch display languages in the top right corner, currently supporting Chinese and English.

**Contact Information**
Discord: linco0357


