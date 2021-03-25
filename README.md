# enum-hub

## Install

```
$ npm install @mopeys/enum-hub
```

## Usage

```js
const eh = new EnumHub({
  fetchRemote: async (name) => {
    return await fetch(`/api/enum/${name}`);
  },
});

async function main() {
  await eh.getEnum("MEDICAL_TYPE"); // first time, from remote
  await eh.getEnum("MEDICAL_TYPE"); // from local
}

main();
```
