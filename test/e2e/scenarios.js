'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {

  browser.get('index.html');

  it('should filter the person list as user types into the search box', function() {
    var peopleList = element.all(by.repeater('p in people'));
    var query = element(by.model('person_query'));

    expect(peopleList.count()).toBe(2);
    query.sendKeys('apw');
    expect(peopleList.count()).toBe(1);
  });

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/view1');
  });

  it('should render people specific links', function() {
    var query = element(by.model('person_query'));
    query.sendKeys('apw');
    element(by.css('.people a')).click();
    browser.getLocationAbsUrl().then(function(url) {
      expect(url.split('#')[1]).toBe('/people/1');
    });
  });

 
});
