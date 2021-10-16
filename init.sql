CREATE DATABASE IF NOT EXISTS abc_bank;
USE abc_bank;
IF  NOT EXISTS (SELECT * FROM sys.objects
WHERE object_id = OBJECT_ID(N'abc_bank.bank_transaction') AND type in (N'U'))
BEGIN
CREATE TABLE abc_bank.bank_transaction(
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `date` varchar(50) NOT NULL,
      `content` varchar(50) NOT NULL,
      `amount` varchar(50) NOT NULL,
      `type` varchar(50) NOT NULL,
      PRIMARY KEY (`id`)
)
END;