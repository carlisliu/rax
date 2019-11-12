/* @jsx createElement */

import {createElement, createContext, Component, Fragment} from 'rax';
import {renderToString} from '../index';

describe('elements and children', () => {
  describe('text children', function() {
    it('a div with text', () => {
      const str = renderToString(
        <div>Text</div>
      );
      expect(str).toBe('<div>Text</div>');
    });

    it('a div with text with flanking whitespace', () => {
      const str = renderToString(
        <div>  Text </div>
      );
      expect(str).toBe('<div>  Text </div>');
    });

    it('a div with an empty text child', () => {
      const str = renderToString(
        <div>{''}</div>
      );
      expect(str).toBe('<div></div>');
    });

    it('a div with multiple empty text children', () => {
      const str = renderToString(
        <div>
          {''}
          {''}
          {''}
        </div>
      );
      expect(str).toBe('<div></div>');
    });

    it('a div with multiple whitespace children', () => {
      const str = renderToString(
        <div>
          {' '}
          {' '}
          {' '}
        </div>
      );
      expect(str).toBe('<div>   </div>');
    });

    it('a div with text sibling to a node', () => {
      const str = renderToString(
        <div>
          Text<span>More Text</span>
        </div>
      );
      expect(str).toBe('<div>Text<span>More Text</span></div>');
    });

    it('a non-standard element with text', () => {
      const str = renderToString(
        <nonstandard>
          Text
        </nonstandard>
      );
      expect(str).toBe('<nonstandard>Text</nonstandard>');
    });

    it('a custom element with text', () => {
      const str = renderToString(
        <custom-element>
          Text
        </custom-element>
      );
      expect(str).toBe('<custom-element>Text</custom-element>');
    });

    it('a leading blank child with a text sibling', () => {
      const str = renderToString(<div>{''}foo</div>);
      expect(str).toBe('<div>foo</div>');
    });

    it('a leading blank child with a text sibling', () => {
      const str = renderToString(<div>{''}foo</div>);
      expect(str).toBe('<div>foo</div>');
    });

    it('a trailing blank child with a text sibling', () => {
      const str = renderToString(<div>foo{''}</div>);
      expect(str).toBe('<div>foo</div>');
    });

    it('an element with two text children', () => {
      const str = renderToString(
        <div>
          {'foo'}
          {'bar'}
        </div>
      );
      expect(str).toBe('<div>foobar</div>');
    });

    it('a component returning text node between two text nodes', () => {
      const B = () => 'b';
      const str = renderToString(
        <div>
          {'a'}
          <B />
          {'c'}
        </div>
      );
      expect(str).toBe('<div>abc</div>');
    });

    it('a tree with sibling host and text nodes', () => {
      class X extends Component {
        render() {
          return [null, [<Y key="1" />], false];
        }
      }

      function Y() {
        return [<Z key="1" />, ['c']];
      }

      function Z() {
        return null;
      }

      const str = renderToString(
        <div>
          {[['a'], 'b']}
          <div>
            <X key="1" />
            d
          </div>
          e
        </div>,
      );
      expect(str).toBe('<div>ab<div><!-- _ --><!-- _ -->c<!-- _ -->d</div>e</div>');
    });
  });

  describe('number children', function() {
    it('a number as single child', () => {
      const str = renderToString(
        <div>{3}</div>
      );
      expect(str).toBe('<div>3</div>');
    });

    it('zero as single child', () => {
      const str = renderToString(
        <div>{0}</div>
      );
      expect(str).toBe('<div>0</div>');
    });

    it('an element with number and text children', () => {
      const str = renderToString(
        <div>
          {'foo'}
          {40}
        </div>
      );
      expect(str).toBe('<div>foo40</div>');
    });
  });

  describe('null, false, and undefined children', function() {
    it('render null single child as blank', () => {
      const str = renderToString(
        <div>{null}</div>
      );
      expect(str).toBe('<div><!-- _ --></div>');
    });

    it('render false single child as blank', () => {
      const str = renderToString(
        <div>{false}</div>
      );
      expect(str).toBe('<div><!-- _ --></div>');
    });

    it('render undefined single child as blank', () => {
      const str = renderToString(
        <div>{undefined}</div>
      );
      expect(str).toBe('<div><!-- _ --></div>');
    });

    it('render a null component children as empty', () => {
      const NullComponent = () => null;
      const str = renderToString(
        <div><NullComponent /></div>
      );
      expect(str).toBe('<div><!-- _ --></div>');
    });

    it('render null children as blank', () => {
      const str = renderToString(
        <div>{null}foo</div>
      );
      expect(str).toBe('<div><!-- _ -->foo</div>');
    });

    it('render false children as blank', () => {
      const str = renderToString(
        <div>{false}foo</div>
      );
      expect(str).toBe('<div><!-- _ -->foo</div>');
    });

    it('render null and false children together as blank', () => {
      const str = renderToString(
        <div>
          {false}
          {null}foo{null}
          {false}
        </div>
      );
      expect(str).toBe('<div><!-- _ --><!-- _ -->foo<!-- _ --><!-- _ --></div>');
    });

    it('render only null and false children as blank', () => {
      const str = renderToString(
        <div>
          {false}
          {null}
          {null}
          {false}
        </div>
      );
      expect(str).toBe('<div><!-- _ --><!-- _ --><!-- _ --><!-- _ --></div>');
    });
  });

  describe('elements with implicit namespaces', function() {
    it('an svg element', () => {
      const str = renderToString(
        <svg />
      );
      expect(str).toBe('<svg></svg>');
    });

    it('svg child element with an attribute', () => {
      const str = renderToString(
        <svg viewBox="0 0 0 0" />
      );
      expect(str).toBe('<svg viewBox="0 0 0 0"></svg>');
    });

    it('svg child element with a namespace attribute', () => {
      const str = renderToString(
        <svg>
          <image xlinkHref="http://i.imgur.com/w7GCRPb.png" />
        </svg>
      );
      expect(str).toBe('<svg><image xlinkHref="http://i.imgur.com/w7GCRPb.png"></image></svg>');
    });

    it('svg child element with a badly cased alias', () => {
      const str = renderToString(
        <svg>
          <image xlinkhref="http://i.imgur.com/w7GCRPb.png" />
        </svg>
      );
      expect(str).toBe('<svg><image xlinkhref="http://i.imgur.com/w7GCRPb.png"></image></svg>');
    });

    it('svg element with a tabIndex attribute', () => {
      const str = renderToString(<svg tabIndex="1" />);
      expect(str).toBe('<svg tabIndex="1"></svg>');
    });

    it('svg element with a badly cased tabIndex attribute', () => {
      const str = renderToString(<svg tabindex="1" />);
      expect(str).toBe('<svg tabindex="1"></svg>');
    });

    it('svg element with a mixed case name', () => {
      const str = renderToString(
        <svg>
          <filter>
            <feMorphology />
          </filter>
        </svg>
      );
      expect(str).toBe('<svg><filter><feMorphology></feMorphology></filter></svg>');
    });

    it('a math element', () => {
      const str = renderToString(<math />);
      expect(str).toBe('<math></math>');
    });
  });

  it('an img', () => {
    const str = renderToString(<img />);
    expect(str).toBe('<img>');
  });

  it('a button', () => {
    const str = renderToString(<button />);
    expect(str).toBe('<button></button>');
  });

  it('a noscript with children', () => {
    const str = renderToString(
      <noscript>
        <div>Enable JavaScript to run this app.</div>
      </noscript>
    );
    expect(str).toBe('<noscript><div>Enable JavaScript to run this app.</div></noscript>');
  });

  describe('elements with implicit namespaces', function() {
    it('a div with dangerouslySetInnerHTML number', () => {
      const str = renderToString(
        <div>
          <span dangerouslySetInnerHTML={{__html: 0}} />
        </div>
      );
      expect(str).toBe('<div><span>0</span></div>');
    });

    it('a div with dangerouslySetInnerHTML boolean', () => {
      const str = renderToString(
        <div>
          <span dangerouslySetInnerHTML={{__html: false}} />
        </div>
      );
      expect(str).toBe('<div><span>false</span></div>');
    });

    it('a div with dangerouslySetInnerHTML text string', () => {
      const str = renderToString(
        <div>
          <span dangerouslySetInnerHTML={{__html: 'hello'}} />
        </div>
      );
      expect(str).toBe('<div><span>hello</span></div>');
    });

    it('a div with dangerouslySetInnerHTML element string', () => {
      const str = renderToString(
        <div dangerouslySetInnerHTML={{__html: "<span id='child'/>"}} />
      );
      expect(str).toBe("<div><span id='child'/></div>");
    });

    it('a div with dangerouslySetInnerHTML object', () => {
      const obj = {
        toString() {
          return "<span id='child'/>";
        },
      };
      const str = renderToString(
        <div dangerouslySetInnerHTML={{__html: obj}} />
      );
      expect(str).toBe("<div><span id='child'/></div>");
    });

    it('a div with dangerouslySetInnerHTML set to null', () => {
      const str = renderToString(
        <div dangerouslySetInnerHTML={{__html: null}} />
      );
      expect(str).toBe('<div></div>');
    });

    it('a div with dangerouslySetInnerHTML set to undefined', () => {
      const str = renderToString(
        <div dangerouslySetInnerHTML={{__html: undefined}} />
      );
      expect(str).toBe('<div></div>');
    });
  });

  describe('newline-eating elements', function() {
    it('a newline-eating tag with content not starting with \\n', () => {
      const str = renderToString(
        <pre>Hello</pre>
      );
      expect(str).toBe('<pre>Hello</pre>');
    });

    it('a newline-eating tag with content starting with \\n', () => {
      const str = renderToString(
        <pre>{'\nHello'}</pre>
      );
      expect(str).toBe('<pre>\nHello</pre>');
    });

    it('a normal tag with content starting with \\n', () => {
      const str = renderToString(
        <div>{'\nHello'}</div>
      );
      expect(str).toBe('<div>\nHello</div>');
    });
  });
});