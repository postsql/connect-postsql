/*!
 * Connect - PostSQL
 * Copyright(c) 2014 Hanno Krosing <hannu@2ndQuadrant.com>
 * MIT Licensed
 */


/**
 * Return the `PostSQLStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

  /**
   * Connect's Store.
   */

  var Store = connect.session.Store;

  /**
   * Initialize PostSQLStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function PostSQLStore(options) {
    var self = this;

    options = options || {};
    Store.call(this, options);

    var pg = require('pg');

    this.pg_client = new pg.Client(options);
    this.pg_client.connect(function(err){if (err) {console.log(err)};});

  };

  /**
   * Inherit from `Store`.
   */

  PostSQLStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  PostSQLStore.prototype.get = function(sid, fn){
    this.pg_client.query("SELECT data_out FROM express_store_get($1)", [sid], function(err,res) {
      if (err) {
        console.log('get err:' + JSON.stringify(err));
        return fn(err);
      }
      console.log('get res:' + JSON.stringify(res))
      return fn(null, res.rows[0].data_out);
//      return fn(null, res.rows[0].data_out || null);
    });
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  PostSQLStore.prototype.set = function(sid, sess, fn){
    try {
      this.pg_client.query("SELECT express_store_set($1,$2)", [sid, sess], function(err,res) {
        if (err) {
          console.log('set ERROR:' + JSON.stringify(err));
          return fn && fn(err);
        }
        fn && fn(null);
      });
    } catch (err) {
      console.log('set CATCHED:' + JSON.stringify(err));
      fn && fn(err);
    } 
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  PostSQLStore.prototype.destroy = function(sid, fn){
    this.pg_client.query("SELECT express_store_destroy($1)", [sid], function(err,res) {
        if (err) {
          return fn && fn(err);
        }
        fn && fn();
    });
  };

  PostSQLStore.prototype.length = function(callback) {
    try {
      this.pg_client.query("SELECT length FROM express_store_length()", function(err,res) {
        if (err) {
          return callback && callback(err);
        }
        callback && callback(null, length);
      });
    } catch (err) {
      callback && callback(err);
    } 
  };

  PostSQLStore.prototype.clear = function(callback) {
    this.pg_client.query("SELECT express_store_clear()", function(err,res) {
        if (err) {
          return callback && callback(err);
        }
        callback && callback();
    });
  };

  return PostSQLStore;
};
