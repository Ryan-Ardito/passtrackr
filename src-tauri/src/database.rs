use sqlx::{PgPool, Result};

use crate::{NewPassData, SearchPassRes};

pub async fn creat_pass_query(pool: &PgPool, pass_data: NewPassData) -> Result<()> {
    Ok(())
}

pub async fn log_visit_query(pool: &PgPool, pass_id: i32) -> Result<()> {
    let use_pass_query = format!(
        "
        UPDATE passes
        SET remaining_uses = CASE
                WHEN remaining_uses > 0 THEN remaining_uses - 1
                ELSE 0
            END
        WHERE pass_id = {pass_id};

        "
    );
    sqlx::query(&use_pass_query).execute(pool).await?;
    Ok(())
}

pub async fn search_all_passes(pool: &PgPool, search_term: &str) -> Result<Vec<SearchPassRes>> {
    let search_query = "
        SELECT 
            p.pass_id,
            p.guest_id,
            g.first_name,
            g.last_name,
            g.town,
            p.remaining_uses,
            p.passtype,
            p.active,
            p.creator,
            p.creation_time
        FROM 
            passes AS p
        JOIN 
            guests AS g ON p.guest_id = g.guest_id
        WHERE 
            LOWER(CONCAT(g.first_name, ' ', g.last_name)) LIKE LOWER($1)
            OR
            LOWER(g.last_name) LIKE LOWER($1)
        ORDER BY 
            g.last_name, g.first_name, g.guest_id, p.pass_id;
    ";

    let passes = sqlx::query_as(search_query)
        .bind(format!("{search_term}%"))
        .fetch_all(pool)
        .await?;

    Ok(passes)
}
