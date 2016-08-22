/*
Navicat MySQL Data Transfer

Source Server         : self
Source Server Version : 50703
Source Host           : localhost:3306
Source Database       : xshop

Target Server Type    : MYSQL
Target Server Version : 50703
File Encoding         : 65001

Date: 2016-08-22 10:33:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `advertisement`
-- ----------------------------
DROP TABLE IF EXISTS `advertisement`;
CREATE TABLE `advertisement` (
  `ID` varchar(36) NOT NULL,
  `TITLE` varchar(50) DEFAULT NULL,
  `IMG_SRC` varchar(200) DEFAULT NULL,
  `URL` varchar(200) DEFAULT NULL,
  `TYPE` varchar(20) DEFAULT 'goods',
  `CREATOR_ID` varchar(36) DEFAULT NULL,
  `CREATE_TIME` bigint(16) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of advertisement
-- ----------------------------
INSERT INTO `advertisement` VALUES ('08918c62b67e41bea30ac2f0c10f541a', '飞机杯9月促销', 'http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2014/5/15/1400156566480_706.jpg', 'http://www.qq.com', 'goods', null, '1471226556361');
INSERT INTO `advertisement` VALUES ('4a9f3ee1d46b4e78ae3ea65835348cb6', 'TT9月促销', 'http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2014/5/15/1400156566480_706.jpg', 'http://baidu.com', 'goods', null, '1471226530188');
INSERT INTO `advertisement` VALUES ('a1a14ab817764a3dadd5db5f0df2e4b2', '跳骚 S-21501 促销', 'http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2014/5/15/1400156566480_706.jpg', 'http://www.12306.cn', 'goods', null, '1471226649565');
INSERT INTO `advertisement` VALUES ('bc0a5ea575db41c5a8af1a74b5eebc3d', '测试广告', 'http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2014/5/15/1400156566480_706.jpg', 'http://www.baidu.com', 'goods', null, '1471226972113');
INSERT INTO `advertisement` VALUES ('ffc44495dde34dda9f725b7ab983fa3b', '跳骚 S-2001 促销', 'http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2014/5/15/1400156566480_706.jpg', 'http://www.360.com', 'goods', null, '1471226617638');

-- ----------------------------
-- Table structure for `goods`
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `ID` varchar(36) NOT NULL,
  `TITLE` varchar(100) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  `IMG_SRC` varchar(200) DEFAULT NULL,
  `SELLING_PRICE` double(8,2) DEFAULT NULL,
  `COST_PRICE` double(8,2) DEFAULT NULL,
  `GOODS_CATEGORY_ID` varchar(36) DEFAULT NULL,
  `CREATE_TIME` bigint(16) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('3ef00a33eda6469f843595898c10c211', '冈本 ', '冈本2016新品上市', null, '22.30', '12.10', '271ab92314774bd999e5c054dcc19573', '1470905495787');
INSERT INTO `goods` VALUES ('811a462ffa4e493c8f79510d407a869f', '杜蕾斯', '杜蕾斯2016新品上市', null, '22.30', '12.10', '271ab92314774bd999e5c054dcc19573', '1470904744051');
INSERT INTO `goods` VALUES ('af408c7f4717430c989229b7c68b8522', '飞机杯', '【大号】至尊版飞机杯', null, '22.30', '12.10', 'b0ba2391d44d41faaecace2a48c8c504', '1470905589240');

-- ----------------------------
-- Table structure for `goods_category`
-- ----------------------------
DROP TABLE IF EXISTS `goods_category`;
CREATE TABLE `goods_category` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(50) DEFAULT NULL,
  `PARENT_ID` varchar(36) DEFAULT NULL,
  `CODE` varchar(100) DEFAULT NULL,
  `CREATE_TIME` bigint(16) DEFAULT NULL,
  `CREATOR_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods_category
-- ----------------------------
INSERT INTO `goods_category` VALUES ('0', '顶级节点', null, '0001', null, null);
INSERT INTO `goods_category` VALUES ('271ab92314774bd999e5c054dcc19573', '安全套', '0', '0001-0002', '1470884790150', null);
INSERT INTO `goods_category` VALUES ('a3d708da05224854821862e506f0dac8', '延时杯', '0', '0001-0004', '1470884993957', null);
INSERT INTO `goods_category` VALUES ('b0ba2391d44d41faaecace2a48c8c504', '飞机杯', '0', '0001-0001', '1470883802273', null);
INSERT INTO `goods_category` VALUES ('e2e3142a598f49e88c6a56f6e9fb4b23', '跳蛋', '0', '0001-0003', '1470884912045', null);

-- ----------------------------
-- Table structure for `shipping_addr`
-- ----------------------------
DROP TABLE IF EXISTS `shipping_addr`;
CREATE TABLE `shipping_addr` (
  `ID` varchar(36) NOT NULL,
  `RECEIVER` varchar(50) DEFAULT NULL COMMENT '收货人',
  `ADDRESS` varchar(50) DEFAULT NULL COMMENT '收货地区',
  `DETAIL_ADDR` varchar(255) DEFAULT NULL COMMENT '详细收货地址',
  `CONTACTS` varchar(20) DEFAULT NULL COMMENT '联系方式',
  `ZIP_CODE` int(8) DEFAULT NULL COMMENT '邮编',
  `CREATE_TIME` bigint(16) DEFAULT NULL,
  `CREATOR_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shipping_addr
-- ----------------------------
INSERT INTO `shipping_addr` VALUES ('95a0d9410de84f1e886a7fead6de5875', '张三疯', '上海市 上海市 闵行区', '333弄', '15901276887', '200000', '1471242663725', 'b6d3137d644949e19d04bf328db60eef');
INSERT INTO `shipping_addr` VALUES ('a27cd42449c84a2ca4a36130efdde26d', '张一疯', '上海市 上海市 闵行区', '333弄', '15901276887', '200000', '1471242685380', 'b6d3137d644949e19d04bf328db60eef');
INSERT INTO `shipping_addr` VALUES ('a52abd914bb5405f92e9446be19c71a5', '张二疯', '上海市 上海市 闵行区', '333弄', '15901276887', '200000', '1471242680327', 'b6d3137d644949e19d04bf328db60eef');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `ID` varchar(36) NOT NULL,
  `NICK_NAME` varchar(100) DEFAULT NULL,
  `REGISTER_RESOUCE` varchar(20) DEFAULT NULL,
  `RESOUCE_TAG` varchar(50) DEFAULT NULL,
  `BIND_EMAIL` varchar(50) DEFAULT NULL,
  `BIND_PHONENUM` varchar(11) DEFAULT NULL,
  `PASSWORD` varchar(36) DEFAULT NULL,
  `CREATE_TIME` bigint(16) DEFAULT NULL,
  `CREATOR_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('285b0dce39e44fe8bf7d314082b404f5', '人民币', null, null, null, null, '123456', '1470818277737', '0');
INSERT INTO `user` VALUES ('83a8eccbf964416e824b746d3a8f54b5', '东方红', null, null, null, null, '123456', '1470818592478', '0');
INSERT INTO `user` VALUES ('b6d3137d644949e19d04bf328db60eef', '韩庆', null, null, '1@qq.com', '15901726887', '123123', '1470818270366', '0');
