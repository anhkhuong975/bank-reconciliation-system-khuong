CREATE DATABASE IF NOT EXISTS abc_bank;
IF  NOT EXISTS (SELECT * FROM sys.objects
WHERE object_id = OBJECT_ID(N'abc_bank.bank-transaction') AND type in (N'U'))
BEGIN
CREATE TABLE abc_bank.bank-transaction(
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `date` varchar(50) NOT NULL,
      `content` varchar(50) NOT NULL,
      `amount` varchar(50) NOT NULL,
      `type` varchar(50) NOT NULL,
      PRIMARY KEY (`id`)
)
END