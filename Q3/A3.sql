CREATE TABLE approval_document (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '결재 문서 id',
	`doc_type` ENUM('VACATION', 'PURCHASE', 'ETC') NOT NULL COMMENT '결재 카테고리',
	`title` VARCHAR(255) NOT NULL COMMENT '문서 제목',
	`drafter_id` INT UNSIGNED NOT NULL COMMENT '기안자 유저 id',
	`content` TEXT NOT NULL COMMENT '결재 문서 내용',
	`status` ENUM('IN_PROGRESS', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'IN_PROGRESS' COMMENT '결재 상태',
	`current_seq` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '현재 결재 진행 중인 순서(단계(seq))',
	`created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_date` DATETIME DEFAULT NULL COMMENT '삭제 시간',
     PRIMARY KEY (`id`),
     KEY `idx_drafter_deleted_created` (`drafter_id`, `deleted_date`, `created_date`),
     KEY `idx_status_current_seq` (`status`, `current_seq`)
     -- CONSTRAINT `approval_document_user` FOREIGN KEY (`drafter_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
     -- 실제 구현 시 유저 테이블과 FK 생성필요
) COMMENT '전자 결재 문서';

CREATE TABLE approval_line (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '결재 라인 id',
	`doc_id` INT UNSIGNED NOT NULL COMMENT '결재 문서 id',
	`approver_id` INT UNSIGNED NOT NULL COMMENT '결재자 유저 id',
	`seq` TINYINT UNSIGNED NOT NULL COMMENT '결재 순서(단계)',
	`status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '결재 상태',
	`created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY `uq_doc_seq` (`doc_id`, `seq`),
    KEY `idx_doc_seq_status` (`doc_id`, `seq`,`status`),
    KEY `idx_approver_status` (`approver_id`, `status`),
    CONSTRAINT `approval_line_doc` FOREIGN KEY (`doc_id`) REFERENCES `approval_document` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
    -- CONSTRAINT `approval_line_user` FOREIGN KEY (`approver_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
    -- 실제 구현 시 유저 테이블과 FK 생성필요
) COMMENT '결재 진행 라인';
  
SELECT  
	ad.id,
	ad.doc_type,
	ad.title,
	ad.drafter_id,
	ad.content,
	ad.status,
	ad.current_seq,
	ad.created_date,
	al.id as line_id,
	al.approver_id,
	al.seq,
	al.status as line_status
FROM approval_line al 
	INNER JOIN approval_document ad 
	ON ad.id = al.doc_id 
	AND ad.current_seq = al.seq 
WHERE al.approver_id = ? 
	AND al.status = 'PENDING'
	AND ad.status = 'IN_PROGRESS' 
	AND ad.deleted_date IS NULL
    ORDER BY ad.created_date ASC; 