BEGIN;

CREATE OR REPLACE FUNCTION populate_organization_preferences()
RETURNS void AS $$
DECLARE
    current_reporting_period_id INT;
BEGIN
    -- Get one valid reporting period id --
    SELECT id INTO current_reporting_period_id
    FROM "ReportingPeriod"
    WHERE "outputTemplateId" IS NOT NULL AND "inputTemplateId" IS NOT NULL
    LIMIT 1;

    -- Update preferences to use new reporting period id --
    IF current_reporting_period_id IS NOT NULL THEN
        UPDATE "Organization"
        SET preferences = COALESCE(
            jsonb_set(preferences, '{current_reporting_period_id}', to_jsonb(current_reporting_period_id)),
            jsonb_build_object('current_reporting_period_id', current_reporting_period_id)
        )
        WHERE preferences IS NULL OR (preferences->'current_reporting_period_id')::text = 'null';
    ELSE
        RAISE NOTICE 'No valid current reporting period ID found';
    END IF;
END;
$$ LANGUAGE plpgsql;

SELECT populate_organization_preferences();

COMMIT;
