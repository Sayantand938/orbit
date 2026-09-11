import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { type UseQueryResult } from "@tanstack/react-query";
import { type ZodSchema } from "zod";
import { type PageConfig } from "@/config/pages";
import { DataPage } from "@/components/DataPage";
import { DataPageForm } from "@/components/DataPageForm";
import { Spinner } from "@/components/ui/spinner";
import { ErrorFallback } from "@/components/ErrorFallback";

export function createDataPage<T extends { id: string | number }>({
    config,
    schema,
    useList,
    useAdd,
    useUpdate,
    useDelete,
}: {
    config: PageConfig<T>;
    schema: ZodSchema;
    useList: () => UseQueryResult<T[], Error>;
    useAdd: () => {
        mutate: (item: Omit<T, "id">) => void;
        mutateAsync: (item: Omit<T, "id">) => Promise<unknown>;
    };
    useUpdate: () => {
        mutate: (params: { id: string | number; updates: Omit<T, "id"> }) => void;
        mutateAsync: (params: { id: string | number; updates: Omit<T, "id"> }) => Promise<unknown>;
    };
    useDelete: () => {
        mutate: (id: string | number) => void;
    };
}) {
    return function DataPageComponent() {
        const location = useLocation();
        const { data = [], isLoading, error } = useList();
        const addMutation = useAdd();
        const updateMutation = useUpdate();
        const deleteMutation = useDelete();

        if (isLoading) {
            return (
                <div className="flex h-full items-center justify-center">
                    <Spinner size="lg" />
                </div>
            );
        }

        if (error) {
            return <div className="p-6 text-destructive">Error: {error.message}</div>;
        }

        return (
            <ErrorBoundary FallbackComponent={ErrorFallback} key={location.pathname}>
                <DataPage
                    title={config.title}
                    singularTitle={config.singularTitle}
                    data={data}
                    columns={config.columns}
                    onAdd={async (newItem) => {
                        await addMutation.mutateAsync(newItem);
                    }}
                    onUpdate={async (id, updates) => {
                        await updateMutation.mutateAsync({ id, updates });
                    }}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    dateFieldKey={config.dateFilterKey}
                    searchFieldKey={config.searchFieldKey}
                    searchPlaceholder={config.searchPlaceholder}
                    categoryFieldKey={config.categoryFieldKey}
                    renderForm={(onSubmit, close, initialData) => (
                        <DataPageForm
                            config={config}
                            schema={schema}
                            onSubmit={onSubmit}
                            onCancel={close}
                            initialData={initialData}
                        />
                    )}
                />
            </ErrorBoundary>
        );
    };
}