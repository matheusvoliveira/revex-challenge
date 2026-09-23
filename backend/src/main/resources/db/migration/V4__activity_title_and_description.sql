ALTER TABLE activities
    ADD COLUMN title VARCHAR(100);

UPDATE activities
SET title = LEFT(description, 100)
WHERE title IS NULL;

ALTER TABLE activities
    ALTER COLUMN title SET NOT NULL;
