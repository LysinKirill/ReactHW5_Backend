export class DatabaseError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export const handleDatabaseError = (error: any) => {
    if (error.code === '23503') {
        throw new DatabaseError('Category not found', 'CATEGORY_NOT_FOUND');
    }

    if (error.code === '23505') {
        throw new DatabaseError('Resource already exists', 'RESOURCE_EXISTS');
    }

    throw error;
};