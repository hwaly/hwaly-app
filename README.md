# hwaly-app
## 해당 페이지의 자바스크립트 실행

### findId
- 기본값 'id'
- 인자 값으로 'id' 또는 'data' 가능
- 'id': body의 'id' 값
- 'data': body의 'data-app-id' 값


### usePrefix
- 기본값 true
- 
```javascript
&lt;body id="app-test-sample">

app.usePrefix(true);
- test, testSample 실행

app.usePrefix(false);
- app, appTest, appTestSample 실행
```




```javascript
import App from 'hwaly-app';

import {test, testA, testB, testC, testTest} from './test';
import {site, siteTest, siteTestTest} from './site';
import common from './common';
import util from './util';




new App({
    findId: 'id',
    usePrefix: true,
    add: {
        test, testA, testB, testC, testTest,
        site, siteTest, siteTestTest,
        common,
        util
    },
    auto: ['common', 'util'],
    callback() {
        console.log('callback');
    }
});



const app = new App();

app.add({test, testA, testB, testC, testTest});
app.add({site, siteTest, siteTestTest});
app.add({common});
app.add({util});

app.findId('id');
// app.findId('data');

app.usePrefix(false);

// app.auto(['common', 'util'])
app.auto('common', 'util');
app.readyAndRun(() => {
    console.log('callback');
});



new App()
    .add({test, testA, testB, testC, testTest})
    .add({site, siteTest, siteTestTest})
    .add({common})
    .add({util})
    .findId('id')
    .usePrefix(false)
    .auto('common', 'util')
    .readyAndRun(() => {
        console.log('callback');
    });
```