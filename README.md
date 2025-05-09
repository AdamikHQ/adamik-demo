### Prerequisites
- Have node.js installed on your computer
- Clone this repo somewhere on your computer: `git clone https://github.com/AdamikHQ/adamik-demo.git`

### 1) Configure your Adamik API key

- Go to https://dashboard.adamik.io to get your free Adamik API key
- Add your key in _env.js_

### 2) Run the demo with the pre-configured chain and account

In a terminal:

- Run `node demo-read.js`
- Run `node demo-write.js`

### 3) Run the same demo with different chains and accounts

- In _chains.js_, edit the pre-configured chains as you wish
- Note that you don't need to change a single line of code besides the configured chains
- Run the demo again with `node demo-read.js` and `node demo-write.js`
